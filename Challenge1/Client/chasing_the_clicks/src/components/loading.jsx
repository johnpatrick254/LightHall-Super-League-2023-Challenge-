import React from "react";
import {Skeleton} from "@mui/material"
const loadingBar = ( type, Width ) => (
    <Skeleton animation="wave"  variant="rounded" width={Width} height={"8.2em"} />)
 
export default loadingBar;