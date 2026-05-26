import {
  useState,
} from "react";

const ManageSlots = () => {
  const [slots, setSlots] =
    useState([]);

  const [slot, setSlot] =
    useState("");

  const handleAddSlot = () => {
    if (!slot) return;

    setSlots([...slots, slot]);

    setSlot("");
  };

  const handleDeleteSlot = (
    index
  ) => {
    const updatedSlots =
      slots.filter(
        (_, i) => i !== index
      );

    setSlots(updatedSlots);
  };

  return (
    <div className="page-container">
      <h1>Manage Slots</h1>

      <div className="slot-container">
        <input
          type="text"
          placeholder="Enter Slot Time"
          value={slot}
          onChange={(e) =>
            setSlot(
              e.target.value
            )
          }
        />

        <button
          onClick={
            handleAddSlot
          }
        >
          Add Slot
        </button>
      </div>

      <div className="slots-list">
        {slots.map(
          (singleSlot, index) => (
            <div
              className="slot-card"
              key={index}
            >
              <p>{singleSlot}</p>

              <button
                onClick={() =>
                  handleDeleteSlot(
                    index
                  )
                }
              >
                Delete
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ManageSlots;