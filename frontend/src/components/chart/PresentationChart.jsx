import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import usePopup from "../../hooks/usePopup";
import CustomTooltip from "./CustomTooltip";
import PresentationHistoryModal from "./PresentationHistoryModal";

const PresentationChart = ({
  data,
  height = 500,
  width = "80%",
  userShortInfoList = [],
  canViewModal = false
}) => {
  const {
    open: openUserInfo,
    handleOpenPopup: handleOpenUserInfo,
    handleClosePopup: handleCloseUserInfo
  } = usePopup();

  const getUserInfo = (userId) => {
    return userShortInfoList.find((user) => user.id === userId);
  };

  const [transFormData, setTransformData] = React.useState([]);
  const [currentAnsw, setcurrentAnsw] = React.useState(null);
  const processData = (data) => {
    const tData = data.map((obj) => {
      return { ...obj, ...getUserInfo(obj.id ? obj.id : obj.uid) };
    });
    setTransformData(tData);
  };

  const handleOpenPopup = (data) => {
    if (canViewModal) {
      processData(data.choiceUserInfo);
      setcurrentAnsw(data.des);
      handleOpenUserInfo();
    }
  };

  if (data.length === 0) return null;
  return (
    <>
      <ResponsiveContainer width={width} height={height}>
        <BarChart
          data={data}
          margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
          onClick={({ activePayload }) =>
            handleOpenPopup(activePayload[0].payload)
          }
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="des" />
          <YAxis width={40} />
          <Tooltip content={<CustomTooltip canViewModal={canViewModal} />} />

          <Bar dataKey="total" fill="#0062e0" />
        </BarChart>
      </ResponsiveContainer>
      <div className="modal-user-info">
        <PresentationHistoryModal
          data={transFormData}
          currentAnsw={currentAnsw}
          isOpen={openUserInfo}
          handleClose={handleCloseUserInfo}
        />
      </div>
    </>
  );
};

export default PresentationChart;
