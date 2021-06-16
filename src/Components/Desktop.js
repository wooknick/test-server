import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import VanillaQR from "../Libraries/VanillaQR.min.js";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Box = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: red;
  position: absolute;
  top: ${(props) => props.position.top + "px"};
  left: ${(props) => props.position.left + "px"};
`;

const QRWrapper = styled.div`
  width: 100px;
  height: 100px;
  position: fixed;
  bottom: 24px;
  right: 24px;
  img {
    width: 100%;
    height: 100%;
  }
`;

const Desktop = () => {
  // const [position, setPosition] = useState({
  //   top: window.innerHeight / 2 - 25,
  //   left: window.innerWidth / 2 - 25,
  // });
  let desktopId = undefined;
  const [boxes, setBoxes] = useState([]);
  const socketRef = useRef();
  const stageRef = useRef();
  const qrRef = useRef();

  useEffect(() => {
    socketRef.current = io("https://10.0.1.4:1234", {
      secure: true,
    });

    socketRef.current.on("connect", () => {
      console.log("connect", socketRef.current.id);
      desktopId = socketRef.current.id;
    });

    socketRef.current.on("playerDisconnect", (id) => {
      console.log("disconnect", id);
      setBoxes((v) => v.filter((box) => box.id !== id));
    });

    socketRef.current.on("desktopPlayerInit", ({ id }) => {
      if (!id || id === desktopId) {
        return;
      }
      console.log(desktopId, id);
      const ref = React.createRef();
      const position = {
        top: window.innerHeight / 2 - 25,
        left: window.innerWidth / 2 - 25,
      };

      setBoxes((v) => [...v, { id, ref, position }]);
    });

    socketRef.current.emit("desktopToServer", "im desktop");
  }, []);

  // useEffect(() => {
  //   console.log(boxes);
  // }, [boxes]);

  useEffect(() => {
    socketRef.current.on("desktopControl", ({ id, data }) => {
      const { absolute, alpha, beta, gamma } = data;
      const box = boxes.filter((box) => box.id === id);
      if (box.length > 0) {
        box[0].ref.current.style.top = box[0].position.top - beta * 10 + "px";
        box[0].ref.current.style.left =
          box[0].position.left + gamma * 10 + "px";
      }
    });
  }, [boxes]);

  useEffect(() => {
    const qr = new VanillaQR({
      url: "https://10.0.1.4:3000",
      // width: "100%",
      // height: "100%",
      // colorLight: "#FAA7F9",
      colorDark: "#3A005E",
      toTable: false,
      ecclevel: 1,
      noBorder: true,
      // borderSize: 4,
    });

    const imageElement = qr.toImage("png");

    qrRef.current.appendChild(imageElement);
  }, []);

  return (
    <Wrapper ref={stageRef}>
      {boxes.map(({ id, ref, position }) => {
        return <Box key={id} id={id} ref={ref} position={position} />;
      })}
      {/* <Box position={position} ref={boxRef} /> */}
      <QRWrapper ref={qrRef} />
    </Wrapper>
  );
};

export default Desktop;
