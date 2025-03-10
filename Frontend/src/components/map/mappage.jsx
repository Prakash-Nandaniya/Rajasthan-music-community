// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import { Icon } from "leaflet";
// import MarkerClusterGroup from "react-leaflet-markercluster";
// import { useNavigate } from "react-router-dom";
// const MapPage = () => {
//     const navigate = useNavigate();
//   const markers = [
//     { position: [26.9124, 75.7873], name: "Manganiyar" },
//     { position: [25.9124, 73.7873], name: "See Label" },
//   ];

//   const customIcon = new Icon({
//     iconUrl: "https://cdn-icons-png.flaticon.com/128/535/535239.png",
//     iconSize: [25, 41],
//   });
//   const handleMarkerClick = (name) => {
//     console.log(`Clicked on marker for ${name}`);
//     navigate('/community/1'); // Redirect to community list page
//   }
//   return (
//     <div>
//       <h1>Map Page</h1>
//       <p>Explore the map of music communities in Rajasthan.</p>
//       <MapContainer     
//         center={[26.5, 72.5]} // Centered in western Rajasthan
//         zoom={7}
//         style={{ height: "500px", width: "100%" }}
//         minZoom={7} // Prevents zooming out beyond Rajasthan
//         maxZoom={18} // Allows zooming in to see small villages
//         scrollWheelZoom={true} // Enables zoom with scroll wheel
//         doubleClickZoom={true} // Allows zoom with double click
//         dragging={true} // Enables panning inside Rajasthan
//         maxBounds={[
//           [23.3, 69.3], // Southwest corner
//           [30.2, 78.2], // Northeast corner
//         ]}
//         maxBoundsViscosity={1}
//       >
//         {/* <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         /> */}
// <TileLayer
//   url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
//   attribution="&copy; Esri"
// />

//         <MarkerClusterGroup>
//           {markers.map((marker, index) => (
//             <Marker key={index} position={marker.position} icon={customIcon}  eventHandlers={{
//                 click: (e) => {handleMarkerClick(marker.name);
//                 }, // Redirect on click
//               }}>
//               <Popup>{marker.name}</Popup>
//             </Marker>
//           ))}
//         </MarkerClusterGroup>
//       </MapContainer>
//     </div>
//   );
// };

// export default MapPage;


import React,{ useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useNavigate } from "react-router-dom";

const MapPage = () => {
  const navigate = useNavigate();

  // 🎯 Sample markers with filter categories
  const markers = [
    { position: [26.9124, 75.7873], name: "Manganiyar", community: "Manganiyar", location: "Jaisalmer", instrument: "Kamaicha" },
    { position: [25.9124, 73.7873], name: "See Label", community: "Langa", location: "Barmer", instrument: "Sindhi Sarangi" },
    { position: [27.0, 74.5], name: "Kalbeliya", community: "Kalbeliya", location: "Bikaner", instrument: "Been" },
  ];

  // 🛠️ State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // 🎯 Function to filter markers 
  const filteredMarkers = markers.filter((marker) => {
    return (
      (searchQuery ? marker.name.toLowerCase().includes(searchQuery.toLowerCase()) : true) &&
      (selectedCommunity ? marker.community === selectedCommunity : true) &&
      (selectedInstrument ? marker.instrument === selectedInstrument : true) &&
      (selectedLocation ? marker.location === selectedLocation : true)
    );
  });

  // 🎨 Custom Icon
  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/535/535239.png",
    iconSize: [25, 41],
  });

  const handleMarkerClick = (name) => {
    console.log(`Clicked on marker for ${name}`);
    navigate("/community/1"); // Redirect to community list page
  };

  return (
    <div>
      <h1>Map Page</h1>
      <p>Explore the map of music communities in Rajasthan.</p>

      {/* 🎯 Search and Filter UI */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "5px", width: "200px" }}
        />

        <select onChange={(e) => setSelectedCommunity(e.target.value)}>
          <option value="">Filter by Community</option>
          <option value="Manganiyar">Manganiyar</option>
          <option value="Langa">Langa</option>
          <option value="Kalbeliya">Kalbeliya</option>
        </select>

        <select onChange={(e) => setSelectedInstrument(e.target.value)}>
          <option value="">Filter by Instrument</option>
          <option value="Kamaicha">Kamaicha</option>
          <option value="Sindhi Sarangi">Sindhi Sarangi</option>
          <option value="Been">Been</option>
        </select>

        <select onChange={(e) => setSelectedLocation(e.target.value)}>
          <option value="">Filter by Location</option>
          <option value="Jaisalmer">Jaisalmer</option>
          <option value="Barmer">Barmer</option>
          <option value="Bikaner">Bikaner</option>
        </select>
      </div>

      {/* 🗺️ Map Container */}
      <MapContainer
        center={[26.5, 72.5]}
        zoom={7}
        style={{ height: "500px", width: "100%" }}
        minZoom={7}
        maxZoom={18}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        maxBounds={[
          [23.3, 69.3], // Southwest corner
          [30.2, 78.2], // Northeast corner
        ]}
        maxBoundsViscosity={1}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri"
        />

        <MarkerClusterGroup>
          {filteredMarkers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              icon={customIcon}
              eventHandlers={{
                click: () => handleMarkerClick(marker.name),
              }}
            >
              <Popup>{marker.name}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapPage;
