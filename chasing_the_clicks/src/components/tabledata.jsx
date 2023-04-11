import { TableCell, TableRow } from "@aws-amplify/ui-react";
import React from "react";

const geoTable = (props) => {
  return (
    <TableRow>
      <TableCell>{props.country}</TableCell>
      <TableCell>{props.count}</TableCell>
    </TableRow>
  );
};

export default geoTable;
