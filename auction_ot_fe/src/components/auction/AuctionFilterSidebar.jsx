"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Status } from "@/store/constants";
import { API_ENDPOINT_FETCH_CATEGORY } from "@/services/Endpoints";
import AxiosInstance from "@/store/SetupAxios";
import { DatePicker, Space } from "antd";
const { RangePicker } = DatePicker;

const AuctionFilterSidebar = ({
  isMenuOpen,
  filterOption,
  setFilterOption,
}) => {
  const [value, setValue] = useState([
    filterOption.startPrice,
    filterOption.endPrice,
  ]);
  const [categories, setCategories] = useState([]);
  const getData = async () => {
    try {
      const res = await AxiosInstance.get(API_ENDPOINT_FETCH_CATEGORY);
      if (res.status === 200) {
        setCategories(res.data.categories.$values);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  function valuetext(value) {
    return `${value}`;
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setFilterOption({...filterOption, startPrice: newValue[0], endPrice: newValue[1]})
  };
  return (
    <div className={`filter-sidebar ${isMenuOpen ? "slide" : ""}`}>
      <div className="auction-sidebar">
        <form>
          <div className="single-widget mb-30">
            <h5 className="widget-title">Thể loại</h5>
            <div className="checkbox-container">
              <ul>
                <li>
                  <label className="containerss">
                    <input
                      type="checkbox"
                      checked={!filterOption.categoryId}
                      onChange={() =>
                        setFilterOption({ ...filterOption, categoryId: null })
                      }
                    />
                    <span className="checkmark" />
                    <span>Tất cả</span>
                  </label>
                </li>
                {categories.map((item) => {
                  return (
                    <li key={item.id}>
                      <label className="containerss">
                        <input
                          type="checkbox"
                          checked={filterOption.categoryId == item.id}
                          onChange={() =>
                            setFilterOption({
                              ...filterOption,
                              categoryId: item.id,
                            })
                          }
                        />
                        <span className="checkmark" />
                        <span>{item.name}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="single-widget mb-30">
            <h5 className="widget-title">Trạng thái</h5>
            <div className="checkbox-container">
              <ul>
                <li>
                  <label className="containerss">
                    <input
                      type="checkbox"
                      checked={filterOption.status == Status.Going}
                      onChange={() =>
                        setFilterOption({
                          ...filterOption,
                          status: Status.Going,
                        })
                      }
                    />
                    <span className="checkmark" />
                    <span>Sắp diễn ra</span>
                  </label>
                </li>
                <li>
                  <label className="containerss">
                    <input
                      type="checkbox"
                      onChange={() =>
                        setFilterOption({
                          ...filterOption,
                          status: Status.OnGoing,
                        })
                      }
                      checked={filterOption.status == Status.OnGoing}
                    />
                    <span className="checkmark" />
                    <span>Đang diễn ra</span>
                  </label>
                </li>
                <li>
                  <label className="containerss">
                    <input
                      onChange={() =>
                        setFilterOption({
                          ...filterOption,
                          status: Status.Ended,
                        })
                      }
                      type="checkbox"
                      checked={filterOption.status == Status.Ended}
                    />
                    <span className="checkmark" />
                    <span>Đã kết thúc</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>

          <div className="single-widget mb-30">
            <h5 className="widget-title">Thời gian</h5>
            <div className="checkbox-container">
              <RangePicker
                onChange={(date, dateString) => {
                  const startDate=dateString[0]?.replace(' ', 'T')+'Z'
                  const endDate=dateString[1]?.replace(' ', 'T')+'Z'
                  setFilterOption({...filterOption, startDate: startDate ?? "2000-12-02T11:59:43Z", endDate: endDate?? "2599-12-02T11:59:43Z"})
                }}
                showTime
              />
            </div>
          </div>
          <div className="single-widget mb-30">
            <h5 className="widget-title">Giá</h5>
            <Box
              sx={{ xs: "100%", sm: "50%", md: "33.33%", lg: "25%", xl: "20%" }}
            >
              <Slider
                getAriaLabel={() => "Temperature range"}
                value={value}
                min={0}
                max={999999}
                sx={{
                  color: "#222222", // Change the color here
                }}
                onChange={handleChange}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
              />
              <div className="range-wrap">
                <div className="slider-labels">
                  <div className="caption">
                    <span id="slider-range-value1">${value[0]}</span>
                  </div>
                  <div className="caption">
                    <span id="slider-range-value2">${value[1]}</span>
                  </div>
                </div>
              </div>
            </Box>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuctionFilterSidebar;
