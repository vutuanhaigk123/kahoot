import React from "react";
import { sort } from "fast-sort";
import { SORT_BY } from "../commons/constants";

const useSort = (originalData) => {
  const [sortBy, setSortBy] = React.useState(SORT_BY.TIME_ASKED_DESC);
  const [sortedData, setSortedData] = React.useState(originalData || []);

  // Handle sort
  React.useEffect(() => {
    switch (sortBy) {
      case SORT_BY.ANSWERED:
        setSortedData(originalData.filter((item) => item.isAnswered === true));
        break;
      case SORT_BY.UNANSWERED:
        setSortedData(originalData.filter((item) => item.isAnswered === false));
        break;
      case SORT_BY.TIME_ASKED_ASC:
        setSortedData(sort(originalData).asc((item) => item.ts));
        break;
      case SORT_BY.TIME_ASKED_DESC:
        setSortedData(sort(originalData).desc((item) => item.ts));
        break;
      case SORT_BY.TOTAL_VOTE_ASC:
        setSortedData(sort(originalData).asc((item) => item.upVotes));
        break;
      case SORT_BY.TOTAL_VOTE_DESC:
        setSortedData(sort(originalData).desc((item) => item.upVotes));
        break;

      default:
        break;
    }
  }, [originalData, sortBy]);

  return { sortBy, setSortBy, sortedData };
};

export default useSort;
