import { Grid } from "@mui/material";
import Box from "@mui/material/Box";

import { useState, useEffect } from "react";

import Model from "../components/Model";
import { getModels, IModel } from "../services/Models";


const ModelsPage = () => {
  const [models, setModels] = useState<IModel[]>([]);

  useEffect(() => {
    // TODO: We only see GlobalModels from the last training epoch here.
    //       Should we also enable the possibility to see previous training epochs?
    getModels().then(setModels);
  }, []);

  return (
    // <React.Fragment>
    //   // TODO: Button functionality not implemented yet
    //   <Button variant="contained" >
    //     Create Model
    //   </Button>

    <Box mt={5}>
      {models.length > 0 &&
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 4, md: 6 }}>
          {models.map((model: IModel) => (
            <Grid item key={model.id}>
              <Model model={model} />
            </Grid>
          ))}
        </Grid>
      }
    </Box>
    // </React.Fragment>
  );
};

export default ModelsPage;
