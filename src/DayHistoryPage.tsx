import React, { useMemo } from "react";
import { Table, Button } from "semantic-ui-react";

import { AttendanceType } from "./attendance";
import { useAttendances, useDeleteAttendance } from "./useAttendances";
import { useUser } from "./useUser";
import { useRouteMatch } from "react-router-dom";
import { getTimePart } from "./time";

export const DayHistoryPage: React.FC = () => {
  const match = useRouteMatch<{ year: string; month: string; day: string }>();
  const [year, month, day] = [
    match.params.year,
    match.params.month,
    match.params.day,
  ];
  const { data, loading: isLoadingUser } = useUser();
  const {
    attendances: allAttendances,
    isLoading: isLoadingAttendance,
  } = useAttendances(data?.userId, +year, +month);
  const { deleteAttendance, loading: deleting } = useDeleteAttendance();
  const attendances = useMemo(
    () =>
      allAttendances?.filter(
        (attendance) => attendance.occurredAt.getDate() === +day
      ),
    [allAttendances, day]
  );

  if (isLoadingUser || isLoadingAttendance) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Action</Table.HeaderCell>
            <Table.HeaderCell>Occurred</Table.HeaderCell>
            <Table.HeaderCell>詳細</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {attendances?.map((attendance) => (
            <Table.Row key={attendance.id}>
              <Table.Cell>{AttendanceType[attendance.type]}</Table.Cell>
              <Table.Cell>{getTimePart(attendance.occurredAt)}</Table.Cell>
              <Table.Cell>
                <Button
                  onClick={() => {
                    // eslint-disable-next-line
                    if (confirm("本当に削除しますか?")) {
                      deleteAttendance(data?.userId, attendance);
                    }
                  }}
                  disabled={deleting}
                >
                  削除
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
