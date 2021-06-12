import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import io from "socket.io-client";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid blue;
`;

const Button = styled.div`
  width: 300px;
  height: 300px;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  color: white;
`;

const Mobile = () => {
  const [control, setControl] = useState(false);
  const [orientation, setOrientation] = useState({
    absolute: false,
    alpha: null,
    beta: null,
    gamma: null,
  });
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("https://10.0.1.4:1234", {
      secure: true,
    });

    socketRef.current.on("serverToMobile", (arg) => {
      //
    });
    socketRef.current.emit("mobileToServer", "im mobile");
  }, []);

  const handleOrientation = (event) => {
    const { absolute, alpha, beta, gamma } = event;
    const data = { absolute, alpha, beta, gamma };
    setOrientation(data);
    socketRef.current.emit("mobileToServer", data);
  };

  const getAccel = () => {
    DeviceMotionEvent.requestPermission().then((response) => {
      if (response == "granted") {
        setControl((v) => !v);
        window.addEventListener("deviceorientation", handleOrientation, true);
      }
    });
  };

  useEffect(() => {
    return () =>
      window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  const handleButton = () => {
    if (!control) {
      getAccel();
    }
  };

  return (
    <Wrapper>
      {!control ? (
        <Button onClick={handleButton}>START</Button>
      ) : (
        <div>
          <ul>
            <li>ɑ:{orientation.alpha}</li>
            <li>β:{orientation.beta}</li>
            <li>γ:{orientation.gamma}</li>
          </ul>
        </div>
      )}
    </Wrapper>
  );
};

export default Mobile;
