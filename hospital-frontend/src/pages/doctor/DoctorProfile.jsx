import {
  useState,
} from "react";

const DoctorProfile = () => {
  const [profile, setProfile] =
    useState({
      name: "",
      specialization: "",
      experience: "",
      fees: "",
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
      <h1>Doctor Profile</h1>

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
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={
            profile.specialization
          }
          onChange={handleChange}
        />

        <input
          type="number"
          name="experience"
          placeholder="Experience"
          value={
            profile.experience
          }
          onChange={handleChange}
        />

        <input
          type="number"
          name="fees"
          placeholder="Consultation Fees"
          value={profile.fees}
          onChange={handleChange}
        />

        <button type="submit">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default DoctorProfile;