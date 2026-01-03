let map;
let placesService;

function initMap() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      map = new google.maps.Map(document.getElementById("map"), {
        center: userLocation,
        zoom: 15,
      });

      // User marker
      new google.maps.Marker({
        position: userLocation,
        map,
        title: "You are here",
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        },
      });

      searchCafes(userLocation);
    },
    () => {
      alert("Unable to retrieve your location");
    }
  );
}

function searchCafes(location) {
  const request = {
    location: location,
    radius: 1000,
    type: ["cafe"],
  };

  placesService = new google.maps.places.PlacesService(map);
  placesService.nearbySearch(request, handleResults);
}

function handleResults(results, status) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    alert("Failed to fetch cafes");
    return;
  }

  results.forEach(createMarker);
}

function createMarker(place) {
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div style="max-width:200px">
        <h3>${place.name}</h3>
        <p>⭐ Rating: ${place.rating || "N/A"}</p>
        <p>${place.vicinity || ""}</p>
        <a target="_blank"
           href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
             place.vicinity
           )}">
           Get Directions
        </a>
      </div>
    `,
  });

  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });
}
