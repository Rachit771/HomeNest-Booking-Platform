const { connectDB } = require("../config/db");
const { createBooking, CheckAvailability } = require("../Service/service");

(async () => {
  try {
    await connectDB();

    const booking = await createBooking(
      "69390a5302e63a27a983b699",
      "68c8573746d2cf9bd2ec1f8e",
      new Date("2026-02-10"),
      new Date("2026-02-15")
    );

    console.log("Booking created:", booking);

    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err.message);
    process.exit(1);
  }
})();


