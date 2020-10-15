import React from  'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import '../../styles/pages/orphanages-map.css';

import mapMarkerImg from '../../images/map-marker.svg';
import mapIcon from '../../utils/mapIcon';

function OrphanagesMap() {
  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Happy App" />

          <h2>Choose an orphanage in the map</h2>
          <p>Many children are waiting for your visit ;)</p>
        </header>

        <footer>
          <strong>Sorocaba</strong>
          <span>São Paulo</span>
        </footer>
      </aside>

      <Map
        center={[-23.4934369, -47.4000453]}
        zoom={15}
        style={{ width: '100%', height: '100%' }}
      >
        {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"></TileLayer> */}
        <TileLayer 
          url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} 
        />

        <Marker 
          icon={mapIcon}
          position={[-23.4934369, -47.4000453]}
        >
          <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup" >
            Centrinho Novo Eldorado
            <Link to="/orphanages/3">
              <FiArrowRight size={20} color="#fff" />
            </Link>
          </Popup>
        </Marker>
        
      </Map>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#ffffff" />
      </Link>
    </div>

  );
}

export default OrphanagesMap;