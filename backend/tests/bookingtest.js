const { connectDB } = require("../config/db");
const { CheckAvailability } = require("../Service/service");

(async function () {
  console.log("TEST START");

  try {
    await connectDB();
    console.log("DB CONNECTED");

    const available = await CheckAvailability(
      "68c8573746d2cf9bd2ec1f8e",
      new Date("2026-02-10"),
      new Date("2026-02-15")
    );

    console.log("Available:", available);
  } catch (err) {
    console.error("ERROR:", err);
  }
})();


