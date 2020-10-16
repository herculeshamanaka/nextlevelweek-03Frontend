import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { useHistory } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

import Sidebar from "../../components/Sidebar";

import '../../styles/pages/create-orphanage.css';
import mapIcon from "../../utils/mapIcon";

import api from "../../services/api";


export default function CreateOrphanage() {
  const history = useHistory();
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [mapPosition, setMapPosition] = useState({latitude: 0, longitude: 0});

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  },[]);

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setMapPosition({
      latitude: lat,
      longitude: lng,
    });
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    const selectedImages = Array.from(event.target.files);
    
    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image);
    });

    setImages(selectedImages);
    setImagesPreview(selectedImagesPreview);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const { latitude, longitude } = mapPosition;
    const formData = new FormData();
    
    formData.append('name', name);
    formData.append('about', about);
    formData.append('instructions', instructions);
    formData.append('latitude', String(latitude));
    formData.append('longitude', String(longitude));
    formData.append('opening_hours', opening_hours);
    formData.append('open_on_weekends', String(open_on_weekends));
    
    images.forEach(image => {
      formData.append('orphanage_images', image);
    });
    
    await api.post('orphanages', formData);

    history.push('/app');

  }

  return (
    <div id="page-create-orphanage">

      <Sidebar />

      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Orphanage data</legend>

            <Map 
              center={initialPosition}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              { mapPosition.latitude !== 0 && (
                  <Marker 
                    interactive={false} 
                    icon={mapIcon} 
                    position={[
                      mapPosition.latitude, 
                      mapPosition.longitude
                    ]} 
                  />
                )
              }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Name</label>
              <input 
                id="name" 
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">About <span>300 characters maximum</span></label>
              <textarea 
                id="name"
                value={about}
                onChange={event => setAbout(event.target.value)}
                maxLength={300} 
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Photos</label>

              <div className="images-container">
                {imagesPreview.map(image => {
                    return (
                      <img key={image} src={image} alt={name}/>
                    );
                  }
                )}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
              <input type="file" id="image[]" multiple onChange={handleSelectImages} />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitings</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instructions</label>
              <textarea 
                id="instructions" 
                value={instructions}
                onChange={event => setInstructions(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Opening hours</label>
              <input 
                id="opening_hours"
                value={opening_hours}
                onChange={event => setOpeningHours(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Open on weekends?</label>

              <div className="button-select">
                <button 
                  type="button" 
                  className={open_on_weekends ? 'active': ''}
                  onClick={event => setOpenOnWeekends(true)}
                >
                  Yes
                </button>
                <button 
                  type="button"
                  className={!open_on_weekends ? 'active': ''}
                  onClick={event => setOpenOnWeekends(false)}
                >
                  No
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Save
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
