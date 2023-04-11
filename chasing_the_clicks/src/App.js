import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableHead,
  Flex,
  TableCell,
  TableRow,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import GeoTable from "./components/tabledata";
function App() {
  const [intClicks, setInt] = useState();
  const [geoInfo, setGeoInfo] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3500/getclicks")
      .then((res) => res.json())
      .then((data) => {
        setInt(data[0].clicks);
      })
      .catch((err) => console.log(err));
  }, []);

  let checkGeoData = () => {
    fetch("http://localhost:3500/newGeodata")
      .then((res) => res.json())
      .then((data) => {
        const geoTable = data.sort((a, b) => {
          return b.count - a.count;
        });
        setGeoInfo(geoTable);
      })
      .catch((err) => console.log(err));
  };
  const handleClicks = () => {
    fetch("http://localhost:3500/updateclicks")
      .then((res) => res.json())
      .then((data) => {
        setInt(data[0].clicks);
      })
      .catch((err) => console.log(err));
  };


  return (
    <div className="App">
      <nav>
        <h1>Chasing Clicks!</h1>
      </nav>
      <section className="main">
        <div className="counter">
          <h1>{intClicks}</h1>
          <Button onClick={handleClicks}>Click Me!</Button>
        </div>
        <div className="geostat">
        <div>
          <hr/>
          <h3>Clicks By Region <Button size="small" onClick={checkGeoData}>Click to Reveal</Button></h3>
          
          </div>
          <Flex direction="column">
            <Table variation="bordered">
              <TableBody>
                <TableRow className="first_table_row">
                  <TableCell><strong>Country</strong></TableCell>
                  <TableCell><strong>Clicks</strong></TableCell>
                </TableRow>
                {geoInfo.map((items, index) => {
                  return (
                    <GeoTable
                      key={index}
                      country={items.country}
                      count={items.count}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </Flex>
        </div>
      </section>
    </div>
  );
}

export default App;
