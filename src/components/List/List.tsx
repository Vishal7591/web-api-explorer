import { useState, useEffect, FC } from "react";
import { Button } from "../Button";
import "./list.scss";
import Drawer from "@mui/material/Drawer";
import { useDispatch } from "react-redux";
import { fetchAPIProviders } from "../../slice/apiProvidersSlice";
import { APIProvider } from "../../types/client/clientTypes";
import { fetchAPIDetails } from "../../slice/apiDetailsSlice";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router";

export const List: FC<any> = () => {
  const dispatch = useDispatch<any>();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [apiProviders, setAPIProviders] = useState<APIProvider>();
  const [apiDetails, setAPIDetails] = useState<any[]>([]);
  const [selectedAPI, setSelectedAPI] = useState<number | undefined>();

  const navigate = useNavigate();

  useEffect(() => {
    const apiProvidersResponse = dispatch(fetchAPIProviders());

    apiProvidersResponse.then((res: any) => {
      setAPIProviders(res.payload);
    });
  }, [dispatch]);

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
    if (!openMenu) {
      setAPIDetails([]);
      setSelectedAPI(undefined);
    }
  };

  const handleAPIProviderClick = (provider: string, index: number) => {
    if (selectedAPI !== index) {
      const apiDetailsResponse = dispatch(fetchAPIDetails(provider));

      apiDetailsResponse.then((result: any) => {
        const apisData = result.payload.apis;
        let detailedAPIResults: any[] = [];
        for (const [key] of Object.entries(apisData)) {
          detailedAPIResults.push(apisData[key]);
        }
        setAPIDetails(detailedAPIResults);
        setSelectedAPI(index);
      });
    } else {
      setSelectedAPI(undefined);
    }
  };

  return (
    <div className="list">
      <Button
        onClick={() => handleOpenMenu()}
        style={{
          backgroundColor: "brown",
          width: "10%",
        }}
        dangerouslySetInnerHTML={{ __html: "Explore Web APIs" }}
      />
      <Drawer open={openMenu} onClose={() => handleOpenMenu()}>
        {apiProviders?.data?.length! > 0 &&
          apiProviders?.data.map((provider, index) => (
            <div key={index} className="list-drawer">
              <div
                className="list-item"
                onClick={() => handleAPIProviderClick(provider, index)}
              >
                {provider}
                {selectedAPI && selectedAPI === index ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </div>

              {selectedAPI &&
                selectedAPI === index &&
                apiDetails.map((item, idx) => (
                  <div
                    className="list-submenu"
                    key={idx}
                    onClick={() => navigate("details", { state: item })}
                  >
                    <img
                      src={item.info["x-logo"].url}
                      alt={item.info.title}
                      height={25}
                    />
                    <span style={{ marginInlineStart: 5 }}>
                      {item.info.title}
                    </span>
                  </div>
                ))}
            </div>
          ))}
      </Drawer>
    </div>
  );
};
