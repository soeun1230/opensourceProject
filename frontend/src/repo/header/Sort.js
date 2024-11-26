import "../../css/Sort.css";

const Sort = () => {
  return (
    <div className="sort">
      <div className="filename">파일 명</div>
      <select>
        <option value="" disabled selected hidden>
          품질 점수
        </option>
        <option value="high">높은 순</option>
        <option value="low">낮은 순</option>
      </select>
    </div>
  );
};

export default Sort;
