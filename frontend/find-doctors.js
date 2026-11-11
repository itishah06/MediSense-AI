
document.addEventListener("DOMContentLoaded", function () {
    const mapContainer = document.getElementById("doctor-map");
    const locationInput = document.getElementById("location-input");
    const specialtySelect = document.getElementById("specialty-select");
    const searchButton = document.getElementById("doctor-search-btn");
    const currentLocationButton = document.getElementById("current-location-btn");
    const specialtyFilters = document.getElementById("specialty-filters");
    const doctorResults = document.getElementById("doctor-results");
    const doctorCount = document.getElementById("doctor-count");
    const sortButton = document.getElementById("sort-distance-btn");

    if (!mapContainer || typeof L === "undefined") {
        console.error("Map container or Leaflet library not found.");
        return;
    }

    // Initialize the map with a default Jaipur view.
    const map = L.map("doctor-map").setView([26.9124, 75.7873], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

   const markersLayer = L.markerClusterGroup();
map.addLayer(markersLayer);

    let allFacilities = [];
    let activeSpecialty = "";

    const specialtyKeywords = {
        "General Physician": ["doctor", "general"],
        "Cardiologist": ["cardiology", "cardiologist"],
        "Dermatologist": ["dermatology", "dermatologist"],
        "Neurologist": ["neurology", "neurologist"],
        "Orthopedic": ["orthopedic", "orthopaedic"],
        "Dentist": ["dentist", "dental"],
        "Pediatrician": ["pediatric", "paediatric"]
    };

    function showMessage(message) {
        doctorResults.innerHTML = `
            <div class="doctor-card">
                <h3>${message}</h3>
            </div>
        `;
        doctorCount.textContent = "(0 results)";
    }

    function escapeHTML(value) {
        return String(value || "").replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[char];
        });
    }

    function getFacilityName(tags) {
        return tags.name ||
            tags["name:en"] ||
            tags.operator ||
            "Unnamed healthcare facility";
    }

    function getFacilityType(tags) {
        return tags.healthcare ||
            tags.amenity ||
            "Healthcare facility";
    }

    function getCoordinates(element) {
        if (element.lat !== undefined && element.lon !== undefined) {
            return {
                lat: element.lat,
                lon: element.lon
            };
        }

        if (element.center) {
            return {
                lat: element.center.lat,
                lon: element.center.lon
            };
        }

        return null;
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const earthRadius = 6371;
        const toRadians = value => value * Math.PI / 180;

        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) ** 2;

        return 2 * earthRadius *
            Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // Convert a city or PIN code into map coordinates.
    
 // Convert an Indian city or PIN code into map coordinates.
async function getLocationCoordinates(place) {
    const isPinCode = /^\d{6}$/.test(place.trim());

    const params = new URLSearchParams({
        format: "jsonv2",
        limit: "5",
        countrycodes: "in",
        addressdetails: "1"
    });

    if (isPinCode) {
        params.set("postalcode", place.trim());
    } else {
        params.set("q", `${place.trim()}, India`);
    }

    const url =
        `https://nominatim.openstreetmap.org/search?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            "Unable to find this location. Please try again."
        );
    }

    const results = await response.json();

    if (!results || results.length === 0) {
        throw new Error(
            "Location not found in India. Please check the city or PIN code."
        );
    }

    // Verify that the returned location belongs to India.
    const indiaResult = results.find(result =>
        result.address &&
        result.address.country_code &&
        result.address.country_code.toLowerCase() === "in"
    );

    if (!indiaResult) {
        throw new Error(
            "Could not verify this location in India. Please try another PIN code."
        );
    }

    return {
        lat: Number(indiaResult.lat),
        lon: Number(indiaResult.lon),
        displayName: indiaResult.display_name
    };
}


    // Search OpenStreetMap for nearby healthcare facilities.
    async function getNearbyFacilities(lat, lon) {
        const query = `
            [out:json][timeout:25];
            (
                node["amenity"~"hospital|clinic|doctors|dentist"](around:5000,${lat},${lon});
                way["amenity"~"hospital|clinic|doctors|dentist"](around:5000,${lat},${lon});
                relation["amenity"~"hospital|clinic|doctors|dentist"](around:5000,${lat},${lon});

                node["healthcare"~"hospital|clinic|doctor|dentist"](around:5000,${lat},${lon});
                way["healthcare"~"hospital|clinic|doctor|dentist"](around:5000,${lat},${lon});
                relation["healthcare"~"hospital|clinic|doctor|dentist"](around:5000,${lat},${lon});
            );
            out center tags;
        `;

        const response = await fetch(
           "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "data=" + encodeURIComponent(query)
            }
        );

        if (!response.ok) {
            throw new Error(
                "The healthcare search service is temporarily unavailable. Please try again."
            );
        }

        const data = await response.json();

        return data.elements
            .map(element => {
                const coordinates = getCoordinates(element);

                if (!coordinates) return null;

                return {
                    id: element.type + "-" + element.id,
                    name: getFacilityName(element.tags || {}),
                    type: getFacilityType(element.tags || {}),
                    address: [
                        element.tags?.["addr:street"],
                        element.tags?.["addr:city"],
                        element.tags?.["addr:postcode"]
                    ].filter(Boolean).join(", ") || "Address not listed",
                    lat: coordinates.lat,
                    lon: coordinates.lon,
                    tags: element.tags || {},
                    distance: calculateDistance(
                        lat, lon,
                        coordinates.lat, coordinates.lon
                    )
                };
            })
            .filter(Boolean);
    }

    function matchesSpecialty(facility, specialty) {
        if (!specialty) return true;

        const keywords = specialtyKeywords[specialty] || [];
        const searchableText = [
            facility.name,
            facility.type,
            facility.tags.speciality,
            facility.tags.healthcare_speciality
        ].join(" ").toLowerCase();

        return keywords.some(keyword =>
            searchableText.includes(keyword.toLowerCase())
        );
    }

    function renderFacilities() {
        markersLayer.clearLayers();

        let facilities = allFacilities.filter(facility =>
            matchesSpecialty(facility, activeSpecialty)
        );

        facilities.sort((a, b) => a.distance - b.distance);

        doctorCount.textContent = `(${facilities.length} results)`;

      if (!facilities.length) {
    if (activeSpecialty) {
        showMessage(
            `No facilities with this specialty were listed in OpenStreetMap for this area. Try All Doctors to see nearby hospitals and clinics.`
        );
    } else {
        showMessage(
            "No nearby healthcare facilities were found. Try another city or PIN code."
        );
    }

    return;
}

        doctorResults.innerHTML = "";

        facilities.forEach(facility => {
            const card = document.createElement("article");
            card.className = "doctor-card";

            card.innerHTML = `
                <div class="doctor-card-top">
                    <div class="doctor-avatar">+</div>

                    <div class="doctor-info">
                        <h3>${escapeHTML(facility.name)}</h3>
                        <span>${escapeHTML(facility.type)}</span>
                        <p>${escapeHTML(facility.address)}</p>
                    </div>
                </div>

                <div class="doctor-meta">
                    <span>📍 ${facility.distance.toFixed(1)} km away</span>
                    <span>OpenStreetMap listing</span>
                </div>
            `;

            doctorResults.appendChild(card);

            const marker = L.marker([
                facility.lat,
                facility.lon
            ]).bindPopup(`
                <strong>${escapeHTML(facility.name)}</strong><br>
                ${escapeHTML(facility.type)}<br>
                ${facility.distance.toFixed(1)} km away
            `);

            markersLayer.addLayer(marker);
        });

        const markerBounds = markersLayer.getLayers();

        if (markerBounds.length) {
            map.fitBounds(
                L.featureGroup(markerBounds).getBounds().pad(0.15),
                { maxZoom: 15 }
            );
        }
    }

    async function searchFacilities(lat, lon) {
        showMessage("Searching nearby healthcare facilities...");

        map.setView([lat, lon], 13);

        try {
            allFacilities = await getNearbyFacilities(lat, lon);
            renderFacilities();
        } catch (error) {
            console.error(error);
            showMessage(error.message);
        }
    }

    // Search using the entered city or PIN code.
    async function handleSearch() {
        const place = locationInput.value.trim();

        if (!place) {
            showMessage("Please enter a city or PIN code first.");
            locationInput.focus();
            return;
        }

        searchButton.disabled = true;
        searchButton.textContent = "Searching...";

        try {
            const location = await getLocationCoordinates(place);
            await searchFacilities(location.lat, location.lon);
        } catch (error) {
            showMessage(error.message);
        } finally {
            searchButton.disabled = false;
            searchButton.textContent = "Search";
        }
    }

    searchButton.addEventListener("click", handleSearch);

    locationInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            handleSearch();
        }
    });

    // Use browser location only after the user clicks the button.
    currentLocationButton.addEventListener("click", function () {
        if (!navigator.geolocation) {
            showMessage("Location access is not supported by this browser.");
            return;
        }

        currentLocationButton.disabled = true;
        currentLocationButton.textContent = "Getting location...";

        navigator.geolocation.getCurrentPosition(
            async function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                await searchFacilities(lat, lon);

                currentLocationButton.disabled = false;
                currentLocationButton.textContent = "◈ Use Current Location";
            },
            function () {
                showMessage(
                    "Location permission was denied or your location is unavailable. Please enter a city or PIN code."
                );

                currentLocationButton.disabled = false;
                currentLocationButton.textContent = "◈ Use Current Location";
            },
            {
                enableHighAccuracy: true,
                timeout: 10000
            }
        );
    });

    // Specialty dropdown.
    specialtySelect.addEventListener("change", function () {
        activeSpecialty = specialtySelect.value;
        updateActiveChip();
        renderFacilities();
    });

    // Specialty filter buttons.
    specialtyFilters.addEventListener("click", function (event) {
        const chip = event.target.closest(".filter-chip");

        if (!chip) return;

        activeSpecialty = chip.dataset.specialty || "";
        specialtySelect.value = activeSpecialty;

        updateActiveChip();
        renderFacilities();
    });

    function updateActiveChip() {
        document.querySelectorAll(".filter-chip").forEach(chip => {
            chip.classList.toggle(
                "active",
                (chip.dataset.specialty || "") === activeSpecialty
            );
        });
    }

    // Results are already sorted by distance.
    sortButton.addEventListener("click", function () {
        renderFacilities();
    });

    // Initially show an instruction instead of fictional doctor profiles.
    showMessage(
        "Enter a city or PIN code and select Search to discover nearby hospitals and clinics."
    );
});
