import React, { useState } from "react";
import ArtistForm from "../artistform/formartist"; 
import "./addartist.css";

export default function AddArtist({ formData, setFormData }) {
    const [index, setIndex] = useState(1);
    // Add a new artist card
    const handleAddArtist = () => {
        setFormData((prev) => ({
            ...prev,
            artists: [...prev.artists, { name: "", profilePicture: null, instrument: "", detail: "", media: { images: [], videos: [] }, isActive: false, index: index }],
        }));
        setIndex((prev) => prev + 1);
    };

    return (
        <>
            <button type="button" onClick={handleAddArtist} className="add-artist-button">
                Add Artist
            </button>
            {formData.artists.map((artist) => (
                <div key={artist.index} className="artist-card">
                    <div className={`dropdown ${artist.isActive ? "active" : ""}`}>
                        <ArtistForm
                            ArtistData={artist}
                            setFormData={setFormData}
                            index={artist.index}
                        />
                    </div>
                </div>
            ))}
        </>
    );
}