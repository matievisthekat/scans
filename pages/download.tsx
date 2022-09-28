import type { NextPage } from "next";

const Download: NextPage = () => {

  return (
    <>
      <header>
        <h1>Download</h1>
      </header>
      <main>
        <form action="/api/download" method="get" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <label htmlFor="email" style={{ display: "block" }}>Input email address: </label>
          <input type="email" name="email" id="email" style={{ display: "block" }} required />

          <button type="submit" className="submit" style={{ marginTop: "20px" }}>Submit</button>
        </form>
      </main>
    </>
  )
};

export default Download;
