"use client";
import { CommonLayout } from "@/layout/CommonLayout";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import view from "../../../public/assets/img/svg/detail.svg";
import edit from "../../../public/assets/img/svg/edit.svg";
import deleteAuction from "../../../public/assets/img/svg/delete.svg";
import payment from "../../../public/assets/img/svg/dollar-sign.svg";

function listOfCreatedAuctions() {
  return (
    <>
      <div className="dashboard-section">
        <div className="container">
          <div className="dashboard-wrapper">
            <div className="dashboard-sidebar-menu"></div>
            <div className="dashboard-content-wrap">
              <div className="bidding-summary-wrap">
                <h6>Danh sách phiên đấu giá đã tạo</h6>
                <table className="bidding-summary-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Tên sản phẩm</th>
                      <th>Giá sản phẩm</th>
                      <th>Ngày tạo phiên</th>
                      <th>Trạng thái</th>
                      <th>Lưu ý</th>
                      <th>#</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td data-label="Auction ID">1</td>
                      <td data-label="Product name">Đồng hồ apple watch</td>
                      <td data-label="Transaction Code">450.000 VND</td>
                      <td
                        data-label="Auction Date"
                        style={{ textAlign: "center" }}
                      >
                        13/02/2024
                      </td>
                      <td data-label="Status">
                        <span>Đã duyệt</span>
                      </td>
                      <td></td>
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >
                        <Image
                          src={view}
                          alt=""
                          width={24}
                          height={24}
                          style={{
                            display: "inline-block",
                            margin: "0 5px",
                            verticalAlign: "middle",
                          }}
                        />
                        <Image src={edit} alt="" width={24} height={24} />
                        <Image
                          src={deleteAuction}
                          alt=""
                          width={24}
                          height={24}
                        />
                        <Image src={payment} alt="" width={24} height={24} />
                      </td>
                    </tr>
                    <tr>
                      <td data-label="Auction ID">2</td>
                      <td data-label="Product name">Sextoy</td>
                      <td data-label="Transaction Code">450.000 VND</td>
                      <td
                        data-label="Auction Date"
                        style={{ textAlign: "center" }}
                      >
                        13/02/2024
                      </td>
                      <td data-label="Status">
                        <span className="cancel">Từ chối</span>
                      </td>
                      <td>Vi phạm ngôn từ</td>
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >
                        <Image
                          src={view}
                          alt=""
                          width={24}
                          height={24}
                          style={{
                            display: "inline-block",
                            margin: "0 5px",
                            verticalAlign: "middle",
                          }}
                        />
                        <Image src={edit} alt="" width={24} height={24} />
                        <Image
                          src={deleteAuction}
                          alt=""
                          width={24}
                          height={24}
                        />
                        <Image src={payment} alt="" width={24} height={24} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="row pt-40">
                <div className="col-lg-12">
                  <div className="inner-pagination-area two">
                    <ul className="paginations">
                      <li className="page-item active">
                        <a href="#">01</a>
                      </li>
                      <li className="page-item">
                        <a href="#">02</a>
                      </li>
                      <li className="page-item">
                        <a href="#">03</a>
                      </li>{" "}
                      <li className="page-item paginations-button">
                        <a href="#">
                          <svg
                            width={16}
                            height={13}
                            viewBox="0 0 16 13"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15.557 10.1026L1.34284 1.89603M15.557 10.1026C12.9386 8.59083 10.8853 3.68154 12.7282 0.489511M15.557 10.1026C12.9386 8.59083 7.66029 9.2674 5.81744 12.4593"
                              strokeWidth="0.96"
                              strokeLinecap="round"
                            />
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default CommonLayout(React.memo(listOfCreatedAuctions));
