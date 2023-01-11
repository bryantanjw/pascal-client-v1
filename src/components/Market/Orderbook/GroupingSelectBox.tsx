import React, { ChangeEvent, FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectGrouping, setGrouping } from "@/store/slices/orderbookSlice";
import { GroupingSelectBoxContainer } from "./styles";

interface GroupingSelectBoxProps {
  options: number[];
}

const GroupingSelectBox: FunctionComponent<GroupingSelectBoxProps> = ({
  options,
}) => {
  const groupingSize: number = useSelector(selectGrouping);
  const dispatch = useDispatch();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setGrouping(Number(event.target.value)));
  };

  return (
    <GroupingSelectBoxContainer>
      <select
        data-testid="groupings"
        name="groupings"
        onChange={handleChange}
        defaultValue={groupingSize}
      >
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            Group {option}
          </option>
        ))}
      </select>
    </GroupingSelectBoxContainer>
  );
};

export default GroupingSelectBox;
