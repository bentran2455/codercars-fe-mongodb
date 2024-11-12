import React, { useCallback, useEffect, useState } from "react";
import apiService from "../app/apiService";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Fab, IconButton, Pagination, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmModal from "../components/ConfirmModal";
import FormModal from "../components/FormModal";
import AddIcon from "@mui/icons-material/Add";
import Search from "../components/Search";

const HomePage = () => {
  const [cars, setCars] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [mode, setMode] = useState("create");
  const [search, setSearch] = useState("");

  const handleClickNew = () => {
    setMode("create");
    setOpenForm(true);
  };
  const handleClickEdit = (id) => {
    setMode("edit");
    setSelectedCar(cars.find((car) => car._id === id));
    setOpenForm(true);
  };

  const handleClickDelete = (id) => {
    setOpenConfirm(true);
    setSelectedCar(cars.find((car) => car._id === id));
  };

  const handleDelete = async () => {
    try {
      await apiService.delete(`/cars/${selectedCar._id}`);
      getData();
    } catch (err) {
      console.log(err);
    }
  };
  const name =
    selectedCar?.release_date +
    " " +
    selectedCar?.make +
    " " +
    selectedCar?.model;
  const columns = [
    { field: "name", headerName: "Name", flex: 3, minWidth: 120 },
    { field: "style", headerName: "Style", flex: 1, minWidth: 120 },
    { field: "size", headerName: "Size", flex: 1, minWidth: 100 },
    {
      field: "transmission_type",
      headerName: "Transmission Type",
      flex: 1.5,
      minWidth: 120,
    },
    { field: "price", headerName: "Price", flex: 1, minWidth: 80 },
    { field: "release_date", headerName: "Year", flex: 1, minWidth: 80 },
    {
      field: "id",
      headerName: "Edit/Delete",
      minWidth: 120,
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleClickEdit(value)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleClickDelete(value)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];
  const rows = cars.map((car) => ({
    id: car._id,
    name: car.make + " " + car.model,
    size: car.size,
    style: car.style,
    transmission_type: car.transmission_type,
    price: car.price,
    release_date: car.release_date,
  }));

  const getData = useCallback(
    async (search) => {
      console.log(">>> what is search", search);
      const url = search
        ? `/cars/search?name=${search}&page=${page}`
        : `/cars?page=${page}`;
      try {
        const result = await apiService.get(url);
        setCars(result.data.cars);
        setTotalPages(result.data.total);
      } catch (err) {
        console.log(err);
        setCars([]);
      }
    },
    [page]
  );

  const handleSearch = (e, search) => {
    e.preventDefault();
    setPage(1);
    getData(search);
  };
  useEffect(() => {
    getData(search);
    // eslint-disable-next-line
  }, [getData]);

  return (
    <Container maxWidth="lg" sx={{ pb: 3 }}>
      <Search
        handleSearch={handleSearch}
        search={search}
        setSearch={setSearch}
      />
      <ConfirmModal
        open={openConfirm}
        name={name}
        handleClose={() => {
          setOpenConfirm(false);
        }}
        action={handleDelete}
      />
      <FormModal
        open={openForm}
        refreshData={() => {
          setOpenForm(false);
          setSelectedCar(null);
          getData();
        }}
        selectedCar={selectedCar}
        handleClose={() => {
          setOpenForm(false);
          setSelectedCar(null);
        }}
        mode={mode}
      />
      <div style={{ height: 630, width: "100%" }}>
        <DataGrid
          disableSelectionOnClick
          rows={rows}
          rowCount={5 * totalPages}
          columns={columns}
          rowsPerPageOptions={[]}
          components={{
            Pagination: () => (
              <Pagination
                color="primary"
                count={totalPages}
                page={page}
                onChange={(e, val) => {
                  setPage(val);
                }}
              />
            ),
          }}
        />
      </div>
      <Fab
        variant="extended"
        color="info"
        onClick={handleClickNew}
        sx={{ position: "fixed", bottom: 10, left: 10 }}
        aria-label="add"
      >
        <AddIcon />
        New
      </Fab>
    </Container>
  );
};
export default HomePage;
