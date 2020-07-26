import React from "react";
import { Button } from "semantic-ui-react";
import { useUser } from "./useUser";
import { Redirect } from "react-router-dom";

import { useLogAttendance } from "./useAttendances";
import { AttendanceType } from "./attendance";

export function LogPage() {
  const { data, loading } = useUser();
  const { logAttendance, loading: loggingAttendance } = useLogAttendance();
  if (loading) {
    return <div>loading...</div>;
  }
  if (!data) {
    return <Redirect to="/signin" />;
  }
  const handleAttendClick = async () => {
    await logAttendance(data.userId, "Arrive");
  };
  const handleLeaveClick = async () => {
    await logAttendance(data.userId, "Leave");
  };
  return (
    <div>
      <Button primary onClick={handleAttendClick}>
        Attend
      </Button>
      <Button secondary onClick={handleLeaveClick}>
        Leave
      </Button>
    </div>
  );
}
