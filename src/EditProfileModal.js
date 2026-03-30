import { useState } from "react";
import "./EditProfileModal.css";

function EditProfileModal({ profile, onClose, onSave }) {
  const [name, setName] = useState(profile.name);
  const [location, setLocation] = useState(profile.location);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Profile</h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />

        <div className="modal-actions">
          <button onClick={() => onSave({ name, location })}>Save</button>
          <button className="cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
