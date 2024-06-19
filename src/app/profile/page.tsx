"use client";
import React, { FormEvent, useEffect, useState } from "react";
import styles from "../../app/profile.module.css";
import { FiEdit, FiTrash } from "react-icons/fi";
import { ProfileType } from "@/types/form.type";
import Image from "next/image";
import axios, { isAxiosError } from "axios";
import { redirect, useRouter } from "next/navigation";
import AddService from "@/components/AddService";
export default function page() {
  //All state variable
  const router = useRouter();
  const [credential, setCredential] = useState<boolean>(true);
  const [btnVisiblity, setBtnVisibility] = useState<boolean>(false);
  const [imgVisiblity, setImgVisibility] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compatibleFileSize, setCompatibleFileSize] = useState<boolean>(false);
  const [imageType, setImageType] = useState<string>("");
  const [data, setData] = useState<ProfileType>({
    username: "",
    name: "",
    email: "",
    phone: "",
    avatar: "",
    address: "",
    role: "",
  });
  const [working, setWorking] = useState("");
  //After click on edit button
  function onEdit(elementId: string, name: string) {
    const element = document.getElementById(elementId);
    element?.removeAttribute("readonly");
    element?.focus();
    setBtnVisibility(true);
  }
  //Handle File Change
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const res = file.size / 1000 <= 1024;
      //Set Compatible and file size to check further whether it is according the our rules or not
      setCompatibleFileSize(res);
      setImageType(file.type);
    }
    setSelectedFile(file || null);
  }

  //On Input Field Value Change
  function onValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  }

  //On textarea value change
  function onTextAreaValueChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  }
  //Working Status Change
  function onWorkingStatus(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setWorking(value);
    console.log(working);
  }

  //On update field
  function onSubmitFunc(e: FormEvent<HTMLElement>) {
    e.preventDefault();
    const formD = new FormData();
    formD.append("name", data.name);
    formD.append("phone", data.phone);
    formD.append("address", data.address);
    formD.append("currentStatus", working);
    if (selectedFile !== null) {
      /*******************Image Type Compatibility************* */
      if (
        imageType !== "image/png" &&
        imageType !== "image/jpg" &&
        imageType != "image/jpeg"
      ) {
        // setLoading(false);
        return alert("Incompatible image file!");
      }
      /**********Image Size Should be less than or equal to 1MB*/
      if (!compatibleFileSize) {
        // setLoading(false);
        return alert("Image Size Should be less than 1 MB!");
      }
      formD.append("avatar", selectedFile);
    }

    axios
      .patch(`http://localhost:5000/api/v1/common/update`, formD, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        alert("Update Successfully");
        return router.replace("/");
      })
      .catch((error) => {
        alert(error);
      });
  }
  //Delete particular service
  function onTrash(id: string) {
    axios
      .delete(`http://localhost:5000/api/v1/employee/delete/service/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        alert("Deleted Successfully...");
        router.refresh();
      })
      .catch((error) => {
        alert(error);
      });
  }
  //Fetching the logged in user info
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/common`, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          setData(response.data.data);
          if (response.data.data.role == "EMPLOYEE") {
            setWorking(response.data.data.currentStatus);
          }
        }
        if (response.status === 401) {
          setCredential(false);
        }
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          if (error?.response?.status === 401) {
            setCredential(false);
            // alert("Invalid Credential !");
          }
          if (error?.response?.status === 409) {
            alert("User with this username or email already exists");
          }
        }
      });
  }, []);

  return credential ? (
    <main className={styles.main}>
      {/*Form for update data */}
      <form
        method="post"
        className={styles.form}
        onSubmit={onSubmitFunc}
        encType="multipart/form-data"
      >
        <div className={styles.imgContainer}>
          {data.avatar != "" && imgVisiblity && (
            <Image
              src={data?.avatar}
              alt="Not Found"
              width={300}
              height={280}
              priority
            />
          )}
          {imgVisiblity && (
            <FiEdit
              size={30}
              className={styles.icon}
              onClick={() => {
                setImgVisibility(false);
                setBtnVisibility(true);
              }}
            />
          )}
          {imgVisiblity == false && (
            <input
              type="file"
              id=""
              name="avatar"
              onChange={handleFileChange}
              required
              autoComplete="off"
            />
          )}
        </div>
        <div className={styles.fieldContainer}>
          <span>
            <input type="text" value={data?.username} readOnly />
          </span>

          <span>
            <input type="text" value={data?.email} readOnly />
          </span>
          <span>
            <input
              type="text"
              placeholder="Enter Name"
              name="name"
              value={data?.name}
              readOnly={true}
              id="name"
              onChange={onValueChange}
              required
            />

            <FiEdit
              size={20}
              className={styles.editIcon}
              onClick={() => {
                onEdit("name", "name");
              }}
            />
          </span>

          <span>
            <input
              type="text"
              placeholder="Enter Phone"
              name="phone"
              id="phone"
              value={data?.phone}
              onChange={onValueChange}
              readOnly
              required
            />{" "}
            <FiEdit
              size={20}
              className={styles.editIcon}
              onClick={() => {
                onEdit("phone", "phone");
              }}
            />
          </span>
          <span>
            <textarea
              placeholder="Enter your HNo, Aparment, Sector , Pincode ,City"
              name="address"
              id="address"
              value={data?.address}
              onChange={onTextAreaValueChange}
              readOnly
              required
            />
            <FiEdit
              size={20}
              className={styles.editIcon}
              onClick={() => {
                onEdit("address", "address");
              }}
            />
          </span>
          {data.role == "EMPLOYEE" && (
            <span>
              <select
                name="currentWorking"
                id=""
                onClick={() => {
                  setBtnVisibility(true);
                }}
                onChange={onWorkingStatus}
              >
                <option
                  value="WORKING"
                  selected={working == "WORKING" ? true : false}
                >
                  WORKING
                </option>
                <option
                  value="NOT WORKING"
                  selected={working == "NOT WORKING" ? true : false}
                >
                  NOT WORKING
                </option>
              </select>
            </span>
          )}

          {btnVisiblity && (
            <div className={styles.updateBtnContainer}>
              <button type="submit" className={styles.updateBtn}>
                Update
              </button>
            </div>
          )}
        </div>
      </form>

      {/*This is for employee once */}
      {data.role == "EMPLOYEE" && (
        <div className={styles.unModifiableContiner}>
          <p>
            <b>Aadhar no : </b>
            {data?.aadhar}
          </p>
          <p>
            <b>Pan no : </b>
            {data?.pan}
          </p>
          <p>
            <b>Role : </b>
            {data?.role}
          </p>
          <p>
            <b>Verified : </b>
            {data?.isVerified}
          </p>
          <p>
            <b>Current Status: </b>
            {data?.currentStatus}
          </p>
        </div>
      )}
      {data.role === "EMPLOYEE" && <AddService userId={data?._id} />}
      {data.role === "EMPLOYEE" && <h2>Your Services</h2>}
      {data.role === "EMPLOYEE" && data.services?.length == 0 && (
        <p>No Service Found !</p>
      )}
      {data.role === "EMPLOYEE" &&
        data.services !== undefined &&
        data.services?.length > 0 && (
          <div className={styles.serviceContainerMain}>
            {data.services?.map(
              (
                item: {
                  _id: string;
                  name: string;
                  timing: string;
                  workingHours: string;
                  preferredLocation: string;
                  salary: string;
                },
                index
              ) => {
                return (
                  <div
                    key={"profileService" + index}
                    className={styles.serviceCard}
                  >
                    <p>
                      <b>Service : </b>
                      {item?.name}
                    </p>
                    <p>
                      <b>Timing : </b>
                      {item?.timing}
                    </p>
                    <p>
                      <b>Working hours : </b>
                      {item?.workingHours}
                    </p>
                    <p>
                      <b>Preferred Location: </b>
                      {item?.preferredLocation}
                    </p>
                    <p>
                      <b>Salary Excepted:</b>
                      {item?.salary}
                    </p>

                    <FiTrash
                      size={25}
                      className={styles.trash}
                      onClick={() => {
                        onTrash(item._id);
                      }}
                    />
                  </div>
                );
              }
            )}
          </div>
        )}
      {data.role === "EMPLOYEE" && <h2>Client Details</h2>}
      {data.role === "EMPLOYEE" && data.clientDetails?.length == 0 && (
        <p>No Service Found !</p>
      )}
      {data.role === "EMPLOYEE" &&
        data.clientDetails !== undefined &&
        data.clientDetails?.length > 0 && (
          <div className={styles.serviceContainerMain}>
            {data.clientDetails?.map(
              (
                item: {
                  clientId: string;
                  paidAmount: string;
                  balanceAmount: string;
                  startDate: string;
                  dueDate: string;
                },
                index
              ) => {
                return (
                  <div
                    key={"profileService" + index}
                    className={styles.serviceCard}
                  >
                    <p>
                      <b>Client Id : </b>
                      {item?.clientId}
                    </p>
                    <p>
                      <b>Paid Amount : </b>
                      {item?.paidAmount}
                    </p>
                    <p>
                      <b>Balanace Amount : </b>
                      {item?.balanceAmount}
                    </p>
                    <p>
                      <b>Starting Date : </b>
                      {item?.startDate}
                    </p>
                    <p>
                      <b>Due Date :</b>
                      {item?.dueDate}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        )}
    </main>
  ) : (
    redirect("/")
  );
}
