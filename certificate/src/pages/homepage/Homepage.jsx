import "./homepage.scss";

const Homepage = () => {
  return (
    <div className="homepage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">
            Blockchain Based Certificate Generation And Validation
          </h1>
          <p>
            This website allows institutions to generate tamper-proof
            certificates using blockchain technology. The process involves
            creating a smart contract on the blockchain that stores the
            certificate data in a decentralized and immutable way.
          </p>

          <div className="boxes">
            <div className="box">
              <h1>10+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>100</h1>
              <h2>Award Gained</h2>
            </div>
            <div className="box">
              <h1>150+</h1>
              <h2>Institutions Use Our Site</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bgimg.jpeg" alt="bg" />
      </div>
    </div>
  );
};

export default Homepage;
