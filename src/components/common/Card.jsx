import { Card as MYOBCard, PageHead } from "@myob/myob-widgets";
import React from "react";

const Card = ({ title, body }) => {
  return (
    <div style={{ background: "#ebeef1", padding: "2.4rem" }}>
      <MYOBCard header={<PageHead title={title}></PageHead>} body={body} />
    </div>
  );
};

export default Card;
