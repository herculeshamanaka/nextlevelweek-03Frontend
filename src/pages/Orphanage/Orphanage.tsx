import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useParams } from 'react-router-dom';

import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

import '../../styles/pages/orphanage.css';
import mapIcon from "../../utils/mapIcon";

interface Orphanage {
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  orphanage_images: Array<{
    id: number;
    url: string;
  }>;
}

interface OrphanageRouteParams {
  id: string;
}

export default function Orphanage() {
  const routeParams = useParams<OrphanageRouteParams>();
  const [orphanage, setOrphanage] = useState<Orphanage>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    api.get(`orphanages/${routeParams.id}`).then(response => {
      setOrphanage(response.data);
    });
  },[routeParams.id]);

  if (!orphanage) {
    return <p>Loading...</p>
  }

  return (
    <div id="page-orphanage">
      <Sidebar /> 

      <main>
        <div className="orphanage-details">
          <img src={orphanage.orphanage_images[activeImageIndex].url} alt={orphanage.name} />

          <div className="images">
            {orphanage.orphanage_images.map((image, imgIndex) => {
              return (
                <button 
                  key={image.id} 
                  className={activeImageIndex === imgIndex ? 'active' : 'inactive'}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(imgIndex);
                  }}
                >
                  <img src={image.url} alt={orphanage.name} />
                </button>
              )   
            })}
          </div>
          
          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>
              {orphanage.about}
            </p>

            <div className="map-container">
              <Map 
                center={[orphanage.latitude, orphanage.longitude]} 
                zoom={16} 
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer 
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker interactive={false} icon={mapIcon} position={[orphanage.latitude, orphanage.longitude]} />
              </Map>

              <footer>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Check routes on Google Maps
                </a>
              </footer>
            </div>

            <hr />

            <h2>Visit instructions</h2>
            <p>
              {orphanage.instructions}
            </p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Monday to Friday <br />
                {orphanage.opening_hours}
              </div>

              { orphanage.open_on_weekends ? (
                  <div className="open-on-weekends">
                    <FiInfo size={32} color="#39CC83" />
                    Open <br />
                    on weekends
                  </div>
              ) : (
                  <div className="open-on-weekends not-opened">
                    <FiInfo size={32} color="#FF6690" />
                    Closed <br />
                    on weekends
                  </div> 
              )}
            </div>

            <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Contact us
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}