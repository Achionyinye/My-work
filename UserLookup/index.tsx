import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import debounce from "lodash.debounce";

import MainWrapper from "../../components/MainWrapper";
import UserModal from "../../components/modals/UserModal";
import { RootState } from "../../store/reducers";
import { getAllUsers, getAllUsersLookup } from "../../store/actions/usersActions";
import Button from "../../components/common/Button";
import Navbar from "../../components/Navbar";
import Pagination from '../../components/common/paginate'



const Users: React.FC = () => {
  const dispatch = useDispatch();
  const { users, loading, test }: any = useSelector((state: RootState) => state.users);
  const [allUsers, setAllUsers] = useState<any>([]);
  const [allUsersLookup, setAllUsersLookup] = useState<any>([]);
  const [selectedUser, setUser] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [searchData, setSearchData] = useState(users);
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredData, setFilteredData] = useState(test);
  const [searchOption, setSearchOption] = useState({ full_name: "Full Name", email: "Email", phone_number: "Phone Number", source: "Partner", defaultValue: "users" });
  const [subscribed, setSubscribed] = useState<any>([]);
  const [showList, setShowList] = useState<boolean>(false);

  const [searchBy, setSearchBy] = useState("Search by")

  // const { dispatcher }: any = useSelector(
  //   (state: RootState) => state.dispatcher.dispatcher
  // );

  const inputRef = useRef(null);

  const arrowUpFromCloud = "https://res.cloudinary.com/djaauazpo/image/upload/v1664260073/Dev/up-arrow-svgrepo-com_csrjzn.svg";
  const arrowdownFromCloud = "https://res.cloudinary.com/djaauazpo/image/upload/v1664259854/Dev/down-arrow-svgrepo-com_akkgdp.svg";
  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllUsersLookup());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleSearch(searchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  useEffect(() => {
    setAllUsers(users);
    setSearchData(users);
  }, [users]);

  useEffect(() => {
    setAllUsersLookup(users);
    // setSearchData(users);
  }, [users]);
  
  // const debounceSearch = debounce(filteredData, 2000);

  const handleSearch = (value: string | any) => {
    // e.preventDefault()
    const searchValue = value;
    const filtered = test.filter(data => {
      if (searchOption.defaultValue === "Full Name") {
        return data?.full_name?.toLowerCase().includes(searchValue.toLowerCase())
      } else if (searchOption.defaultValue === "Email") {
        return data?.email?.toLowerCase().includes(searchValue.toLowerCase())
      } else if (searchOption.defaultValue === "Phone Number") {
        return data?.phone_number?.includes(searchValue)
      } else {
        console.log("searchValue", searchValue.toLowerCase())
        return data?.source?.toLowerCase().includes(searchValue.toLowerCase())
      }
    });

    setFilteredData(filtered);
  }

  const modalView = (_id: string) => {
    const user = allUsers.find((user: any) => user.user_id === _id)
    setUser(user);
    setVisible(true);
  };

  useEffect(() => {
    const sub = users.filter((user: any) => user.is_subscriber === true)
    setSubscribed(sub)

  }, [users])


  const [pages] = useState(Math.round(20));
  const [currentPage, setCurrentPage] = useState(1);

  // const currentTableData = useMemo(() => {
  //   const firstPageIndex = (currentPage - 1) * pages;
  //   const lastPageIndex = firstPageIndex + pages;
  //   return searchData.slice(firstPageIndex, lastPageIndex);
  // }, [currentPage, pages, searchData]);

  const handleSelectOption = (e) => {
    setSearchOption((prev) => ({ ...prev, defaultValue: e.target.value }))
  }

  return (
    <MainWrapper selectedKey="8" shouldHideMenu>
      <Navbar pageTitle="ERA Dispatch" pageDescription="Registered Users" />

      <section onClick = {()=>{
            if(showList){
              setShowList(false)
            }
            }} className="p-5 lg:p-10">
        <div className="flex p-3 w-10/12 ml-20 shadow-lg bg-gray-50 mb-10">
          <div className="bg-white text-gray-400 p-2">
            <button className="searchBtn" value={searchOption.defaultValue} onChange={handleSelectOption} onClick={()=>setShowList(!showList)}>{searchBy}
            <span><img src = {arrowdownFromCloud} alt="arrow down" className="arrowDown"/></span>
            </button>
            {showList && <ul className="dropdown">
              <li className="text-gray-400 text-base" value="">Search by
              <span><img src = {arrowUpFromCloud} alt="arrow up" className="arrowUp"/></span>
              </li>
              <li onClick={() => {
                 inputRef.current.value = ""
                 setSearchOption(prev=>({...prev, defaultValue:prev.full_name}))
                 setSearchBy("Full Name")
                 setShowList(!showList)
                 setFilteredData(test)
              }
                }>Full Name
                <hr/></li>
              <li onClick={() => {
                inputRef.current.value = ""
                setSearchOption(prev=>({...prev, defaultValue:prev.email}))
                setSearchBy("Email")
                setShowList(!showList)
                setFilteredData(test)
              }
              }>Email<hr/></li>
              <li onClick={() => {
                inputRef.current.value = ""
                setSearchOption(prev=>({...prev, defaultValue:prev.phone_number}))
                setSearchBy("Phone")
                setShowList(!showList)
                setFilteredData(test)
              }
              }
              >Phone number<hr/></li>
              <li onClick={() => {
                inputRef.current.value = ""
                setSearchOption(prev=>({...prev, defaultValue:prev.source}))
                setSearchBy("Partner")
                setShowList(!showList)
                setFilteredData(test)
              }
              }
              >Partner<hr/></li>
              </ul>}
          </div>

          <div className="justify-center w-9/12 ml-7">
            <input 
              className="w-full border-2 border-gray-100 py-2 px-3 outline-none"
              placeholder={`Search ${searchOption.defaultValue}`}
              onChange={(e) => setSearchValue(e.target.value)}
              ref = {inputRef}
              // debounceSearch={debounceSearch}
            />
          </div>
          <button className="bg-primary text-white px-5 py-2 rounded-r-md">Search</button>
        </div>
        <div className="mt-5 overflow-x-auto">
          {loading &&
            <div className="w-full h-full flex justify-center items-center">
              {/* <Spin /> */}
            </div>
          }
          <table>
            <thead>
              <tr className="truncate">
                <th className="first-cy">Full name</th>
                <th className="last-cy">Email</th>
                <th className="phone-cy">Phone no</th>
                <th className="address-cy">Address</th>
                <th className="action-cy">Partner</th>
                <th className="empty-cy"></th>
              </tr>
            </thead>
            <tbody>
              {
              filteredData.length?
              filteredData.map((item: any, index: number) => (
                <tr key={index} className="bg-gray-100 border-b-8 border-t-8 border-white">

                  <td>{`${item.full_name}`}</td>
                  <td className="w-1/5">{item.email}</td>
                  <td>{item.phone_number}</td>
                  <td className="w-1/6">{item.address}</td>
                  <td>{item.source}</td>
                  <td>
                    <Button className="view-button" type={"primary"} onClick={() => modalView(item.user_id)}>
                      View details
                    </Button>
                  </td>
                </tr>
              ))
            :
            <div>
              <h1 className="ml-96 mt-20 text-center text-primary text-2xl font-normal">No Entry Found</h1>
            </div>
            }
            </tbody>
          </table>
        </div>
        <UserModal
          visible={visible}
          setVisible={setVisible}
          user={selectedUser}
        />
      </section>
      {filteredData.length?
        <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={searchData.length}
        pageSize={pages}
        onPageChange={(page: any) => setCurrentPage(page)}
      />
    : ""}
    </MainWrapper>
  );
};

export default Users;
