import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import io from "socket.io-client";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Box = styled.div`
  width: 50px;
  height: 50px;
  background-color: red;
  position: absolute;
  top: ${(props) => props.position.top + "px"};
  left: ${(props) => props.position.left + "px"};
`;

const Desktop = () => {
  const [position, setPosition] = useState({
    top: window.innerHeight / 2 - 25,
    left: window.innerWidth / 2 - 25,
  });
  const boxRef = useRef();

  useEffect(() => {
    const socket = io("https://10.0.1.4:1234", {
      secure: true,
    });

    socket.on("serverToDesktop", (data) => {
      const { absolute, alpha, beta, gamma } = data;
      boxRef.current.style.top = position.top - beta * 10 + "px";
      boxRef.current.style.left = position.left + gamma * 10 + "px";
      //   setPosition({
      //     top: position.top + beta * 0.001,
      //     left: position.left + gamma * 0.001,
      //   });
    });

    console.log(boxRef.current.style);
    socket.emit("desktopToServer", "im desktop");
  }, []);

  return (
    <Wrapper>
      <Box position={position} ref={boxRef} />
    </Wrapper>
  );
};

export default Desktop;
