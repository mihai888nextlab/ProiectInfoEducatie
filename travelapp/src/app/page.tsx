import Header from "@/Components/Header";
import "./home.scss";
import Hero from "@/Components/Hero";
import Footer from "@/Components/Footer";

export default function Home() {
  return (
    <div className="home">
      {/* <Header></Header> */}
      <Hero></Hero>

      <div className="flex w-screen justify-center">
        <div className="sm:flex items-center justify-center max-w-screen-xl">
          <div className="sm:w-1/2 p-10">
            <div className="image object-center text-center">
              <img src="https://i.imgur.com/WbQnbas.png" />
            </div>
          </div>
          <div className="sm:w-1/2 p-5">
            <div className="text">
              <span className="text-gray-500 border-b-2 border-indigo-600 uppercase">
                About us
              </span>
              <h2 className="my-4 font-bold text-3xl  sm:text-4xl ">
                About <span className="text-yellow-500">WEBNGO</span>
              </h2>
              <p className="text-gray-700">
                We believe travel should be exciting and adventurous, not
                stressful and overwhelming. That's why we created{" "}
                <span className="text-yellow-500">WEBNGO</span>, your one-stop
                shop for planning the perfect trip.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}
