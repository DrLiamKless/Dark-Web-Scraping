import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Articles from "./articles";

export default function Alerts({articles, setArticles}) {
    
    const { register, watch, errors, handleSubmit } = useForm();
    const allLabels = ['weapons', 'pedophile', 'sexual', 'money', 'buisness', 'social_media'].join(' or ')
    const [labels, setLabels] = useState(allLabels)

    const labelsPicked = watch()
    useEffect(() => {
            (async () => {
                const { data } = await axios.get(`http://localhost:8080/api/es/labels/${labels}`);
                console.log(labels, data)
                setArticles(data);
            })();
      }, [labels]);

      useEffect(() => {
          setLabels(() => {
              if(labelsPicked.labels) {
                  return labelsPicked.labels
              }
              return allLabels
          })
      }, [labelsPicked])

  return (
    <div className="alerts">
        <Form inline style={{color: "white", position:"fixed", top: '5px'}} onSubmit={handleSubmit}>
        <h4 style={{color: "black", paddingRight:'20px', paddingTop:'5px'}}>Found {articles.length} pastes</h4>
            <Form.Control
                ref={register}
                as="select"
                className="my-1 mr-sm-2"
                id="inlineFormCustomSelectPref"
                name="labels"
                custom>
                <option value="">Labels</option>
                <option value="weapons">weapons</option>
                <option value="pedophile">pedophile</option>
                <option value="sexual">sexual</option>
                <option value="money">money</option>
                <option value="buisness">buisness</option>
                <option value="social_media">social media</option>
            </Form.Control>
        </Form>
        <Articles articles={articles}/>
    </div>
  );
}
