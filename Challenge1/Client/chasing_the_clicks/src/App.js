import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  Flex,
  TableCell,
  TableRow,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import GeoTable from "./components/tabledata";
import DOMPurify from "dompurify";
import loadingBar from "./components/loading";
function App() {
  const [geoInfo, setGeoInfo] = useState([]);
  const [intClicks, setInt] = useState();
  const [loaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("https://my-clicks-se-apis.vercel.app/getclicks")
      .then((res) => res.json())
      .then((data) => {
        setInt(data[0].clicks);
        setTimeout(() => {
          setIsLoaded(true);
        }, 1000);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleClicks = () => {
    setInt((prev) => {
      return ++prev;
    });
    fetch("https://my-clicks-se-apis.vercel.app/updateclicks").catch((err) => {
      console.log(err);
      setInt((prev) => {
        return --prev;
      });
    });
  };

  let checkGeoData = () => {
    fetch("https://my-clicks-se-apis.vercel.app/newGeodata")
      .then((res) => res.json())
      .then((data) => {
        const geoTable = data.sort((a, b) => {
          return b.count - a.count;
        });
        setGeoInfo(geoTable);
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
         {!loaded ? loadingBar("spinningBubbles","Black") :<div>
          <h1>{intClicks}</h1>
          <Button  onClick={handleClicks}>Click Me</Button></div>
        }
        </div>
        
        <div className="geostat">
          <div>
                        <hr />
            <h3>
              Clicks By Region{" "}
              <Button className="reveal" size="small" onClick={checkGeoData}>
                Show Ranking
              </Button>
            </h3>
          </div>
          <Flex direction="column">
            <Table variation="bordered">
              <TableBody>
                <TableRow className="first_table_row">
                  <TableCell>
                    <strong>Country</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Total Unique Clicks</strong>
                  </TableCell>
                </TableRow>
                {geoInfo.map((items, index) => {
                  return (
                    <GeoTable
                      key={DOMPurify.sanitize(index)}
                      country={DOMPurify.sanitize(items.country)}
                      count={DOMPurify.sanitize(items.count)}
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
