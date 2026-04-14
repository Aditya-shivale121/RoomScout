const ExpressError = require("./Expresserror");

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

function formatListingLocation(location = {}) {
    return [
        location.address,
        location.area,
        location.city,
    ].filter(Boolean).join(", ");
}

function buildGeometryFromCoordinates(locationCoordinates) {
    const latitude = Number(locationCoordinates?.latitude);
    const longitude = Number(locationCoordinates?.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return null;
    }

    return {
        type: "Point",
        coordinates: [longitude, latitude],
    };
}

async function geocodeListingLocation(location = {}) {
    const query = formatListingLocation(location);

    if (!query) {
        return null;
    }

    if (typeof fetch !== "function") {
        throw new ExpressError(500, "Geocoding requires Node.js 18 or newer.");
    }

    const params = new URLSearchParams({
        q: query,
        format: "jsonv2",
        limit: "1",
        addressdetails: "1",
    });

    if (process.env.NOMINATIM_EMAIL) {
        params.set("email", process.env.NOMINATIM_EMAIL);
    }

    if (process.env.NOMINATIM_COUNTRY_CODES) {
        params.set("countrycodes", process.env.NOMINATIM_COUNTRY_CODES);
    }

    const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
        headers: {
            "User-Agent": process.env.NOMINATIM_USER_AGENT || "RoomScout/1.0 (local-development)",
            "Accept-Language": "en",
        },
    });

    if (!response.ok) {
        throw new ExpressError(response.status, "Could not geocode this room location. Please try again.");
    }

    const results = await response.json();
    const result = Array.isArray(results) ? results[0] : null;
    const latitude = Number(result?.lat);
    const longitude = Number(result?.lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        throw new ExpressError(422, "Could not find map coordinates for this room location. Please enter a more specific address.");
    }

    return {
        geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
        },
        geocodedAddress: result.display_name,
    };
}

function hasLocationChanged(currentLocation = {}, nextLocation = {}) {
    return formatListingLocation(currentLocation) !== formatListingLocation(nextLocation);
}

module.exports = {
    buildGeometryFromCoordinates,
    formatListingLocation,
    geocodeListingLocation,
    hasLocationChanged,
};
