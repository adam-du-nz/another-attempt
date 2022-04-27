import { PageState, Spinner, Card } from "@myob/myob-widgets";
import React from "react";

const CardWithLoadingStatus = ({ title = "Loading" }) => {
  return (
    <div style={{ background: "#ebeef1", padding: "2.4rem" }}>
      <Card>
        <PageState title={title} image={<Spinner size="medium" />}></PageState>
      </Card>
    </div>
  );
};

export default CardWithLoadingStatus;
