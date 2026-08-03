async function check() {
  try {
    const res = await fetch("http://localhost:5000/api/health");
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text);
  } catch (e) {
    console.error("Error:", e);
  }
}
check();
