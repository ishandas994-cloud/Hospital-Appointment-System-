import {
  useState,
} from "react";

import { useAuth } from "../../context/AuthContext";

const PatientProfile = () => {
  const { user } = useAuth();

  const [profile, setProfile] =
    useState({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      age: "",
    });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      "Profile Updated"
    );
  };

  return (
    <div className="page-container">
      <h1>Patient Profile</h1>

      <form
        className="profile-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={profile.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={profile.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={profile.phone}
          onChange={handleChange}
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={profile.age}
          onChange={handleChange}
        />

        <button type="submit">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default PatientProfile;