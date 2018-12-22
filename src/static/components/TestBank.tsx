import React, { ChangeEvent, RefObject } from "react";
import axios from "axios";
import {
  Table,
  Button,
  UncontrolledCollapse,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  FormText
} from "reactstrap";
import { Typeahead, TypeaheadProps } from "react-bootstrap-typeahead";
import { ISimpleUser } from "../../models/User";
import { IAppState } from "../App";
import {
  ICreateSignedUploadURLResponse,
  ITestBankListResponse,
  ITestBankSingleResponse
} from "../../controllers/testBankController";

import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead-bs4.css";
import { ISimpleTestBankFile } from "../../models/TestBankFile";
import { Link } from "react-router-dom";

interface ITestBankProps {
  appState: IAppState;
}

interface IFieldWithValidity<T> {
  value?: T;
  invalid?: boolean;
}

interface IUploadFormState {
  department: IFieldWithValidity<string>;
  courseNumber: IFieldWithValidity<string>;
  professor: IFieldWithValidity<string>;
  year: IFieldWithValidity<string>;
  quarter: IFieldWithValidity<string>;
  file: IFieldWithValidity<File>;
}

interface ITestBankState {
  uploadForm: IUploadFormState;
  isUploading: boolean;
  uploadPercent: number;
  files: ISimpleTestBankFile[];
  message: string;
  queryString: string;
}

const defaultUndefinedState = {
  value: "",
  invalid: undefined
};

const defaultFormState: IUploadFormState = {
  department: defaultUndefinedState,
  courseNumber: defaultUndefinedState,
  professor: defaultUndefinedState,
  year: {
    value: "2018",
    invalid: false
  },
  quarter: {
    value: "Fall",
    invalid: false
  },
  file: {
    value: undefined,
    invalid: undefined
  }
};

const defaultTestBankState: ITestBankState = {
  uploadForm: defaultFormState,
  isUploading: false,
  uploadPercent: 0,
  files: [],
  message: "",
  queryString: ""
};

type StringOrObjectAny = string | any;

class TestBankPage extends React.Component<ITestBankProps, ITestBankState> {
  constructor(props) {
    super(props);
    this.state = defaultTestBankState;
  }

  departmentAutoCompleteRef: any;

  reloadFiles() {
    axios.get<ITestBankListResponse>("/api/files").then(res => {
      console.log(res.data.files);
      this.setState({ files: res.data.files });
    });
  }

  componentWillMount() {
    this.reloadFiles();
  }

  handleUpload = () => {
    console.log(this.state.uploadForm);
    this.setState({ isUploading: true, message: "" });

    const payload = {
      department: this.state.uploadForm.department.value.toUpperCase(),
      courseNumber: this.state.uploadForm.courseNumber.value,
      professor: this.state.uploadForm.professor.value,
      year: this.state.uploadForm.year.value,
      quarter: this.state.uploadForm.quarter.value,
      name: this.state.uploadForm.file.value.name,
      fileType: this.state.uploadForm.file.value.type
    };

    axios
      .post("/api/files/upload-url", payload)
      .then(res => {
        console.log(res.data);
        const data = res.data as ICreateSignedUploadURLResponse;
        const file = new File(
          [this.state.uploadForm.file.value],
          data.fileName,
          { type: this.state.uploadForm.file.value.type }
        );
        return axios.put(data.signedUploadUrl, file, {
          headers: { "Content-Type": file.type },
          onUploadProgress: event => {
            this.setState({
              uploadPercent: (event.loaded / event.total) * 100
            });
          }
        });
      })
      .then(_ => {
        return axios.post("/api/files", payload);
      })
      .then(res => {
        this.departmentAutoCompleteRef.getInstance().clear();
        this.reloadFiles();
        this.setState({
          uploadForm: defaultFormState,
          isUploading: false,
          uploadPercent: 0,
          message: `Successfully uploaded ${payload.name}!`
        });
      })
      .catch(err => {
        console.error(err);
        window.alert(`The upload failed unexpectedly! Error: ${err}`);
      });
  };

  trueValidator = (v: string) => true;

  noTransform = (v: string) => v;

  handleChange = (
    key: string,
    validator?: (string) => boolean,
    transform?: (string) => string
  ) => (evt: ChangeEvent) => {
    const t = transform || this.noTransform;
    const v = validator || this.trueValidator;
    const element = evt.target as HTMLInputElement;
    const value = t(element.value);
    const newState = {
      uploadForm: {
        ...this.state.uploadForm,
        [key]: {
          value: value,
          invalid: !v(value)
        }
      }
    };

    this.setState(newState);
  };

  handleAutoCompleteChange = (key: string, validator?: (string) => boolean) => (
    selected: StringOrObjectAny[]
  ) => {
    const v = validator || this.trueValidator;
    const value = selected[0]
      ? typeof selected[0] === "string"
        ? selected[0]
        : selected[0].label
      : "";

    const newState = {
      uploadForm: {
        ...this.state.uploadForm,
        [key]: {
          value: value,
          invalid: !v(value)
        }
      }
    };

    this.setState(newState);
  };

  handleFileUpload = (evt: ChangeEvent) => {
    const element = evt.target as HTMLInputElement;
    const file = element.files[0];
    const valid =
      file &&
      [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/pdf"
      ].includes(file.type);
    const newState = {
      uploadForm: {
        ...this.state.uploadForm,
        file: {
          value: file,
          invalid: !valid
        }
      }
    };

    this.setState(newState);
  };

  handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const query = evt.target.value;
    this.setState({ queryString: query });
  };

  filteredResults = () => {
    return this.state.files
      .filter(v => {
        return JSON.stringify(v)
          .toLowerCase()
          .includes(this.state.queryString.toLowerCase().trim());
      })
      .sort((a, b) => {
        const department = a.department.localeCompare(b.department);
        if (department === 0) {
          const course = a.courseNumber.localeCompare(b.courseNumber);
          if (course === 0) {
            const year = parseInt(a.year) - parseInt(b.year);
            if (year === 0) {
              return a.professor.localeCompare(b.professor);
            } else {
              return year;
            }
          } else {
            return course;
          }
        } else {
          return department;
        }
      });
  };

  handleGetFile = (id: string) => () => {
    axios.get<ITestBankSingleResponse>(`/api/files/${id}`).then(res => {
      window.location.assign(res.data.signedDownloadUrl);
    });
  };

  render() {
    const FileRow = (file: ISimpleTestBankFile, index: number) => (
      <tr key={index}>
        <td>{file.department}</td>
        <td>{file.courseNumber}</td>
        <td>
          {file.quarter} {file.year}
        </td>
        <td>
          <a href="javascript:void(0)" onClick={this.handleGetFile(file.id)}>
            {file.name}
          </a>
        </td>
        <td>{file.professor}</td>
      </tr>
    );

    const FileTable = () => {
      return this.state.files ? (
        <Table className="mt-2" borderless hover>
          <thead>
            <tr>
              <th>Department</th>
              <th>Course</th>
              <th>Quarter</th>
              <th>File</th>
              <th>Professor</th>
            </tr>
          </thead>
          <tbody>{this.filteredResults().map((u, i) => FileRow(u, i))}</tbody>
        </Table>
      ) : (
        <h4 className="mt-4">Loading...</h4>
      );
    };

    return (
      <div className="page testbank-list-view mt-2">
        <div className="row align-items-center">
          <div className="col">
            <h1 className="mb-0">Test Bank</h1>
          </div>
        </div>
        <div className="divider" />
        <div className="row">
          <div className="col-1">
            <Button color="primary" id="toggler" size="sm">
              Upload
            </Button>
          </div>
          <div className="col-4">
            <Input
              bsSize={"sm"}
              value={this.state.queryString}
              onChange={this.handleSearch}
              type="text"
              placeholder="Search..."
            />
          </div>
        </div>
        <UncontrolledCollapse toggler="#toggler">
          <Form className="mt-2">
            <div className="row">
              <div className="col">
                <FormGroup>
                  <Label for="department">Department</Label>
                  <Typeahead
                    ref={ta => (this.departmentAutoCompleteRef = ta)}
                    inputProps={{
                      name: "department",
                      id: "department"
                    }}
                    options={[
                      ...new Set(this.state.files.map(v => v.department))
                    ]}
                    allowNew={true}
                    placeholder="COM SCI"
                    newSelectionPrefix="New Department:&nbsp;"
                    onChange={this.handleAutoCompleteChange(
                      "department",
                      (arg: string) => arg.length <= 10 && /^[A-Z ]+$/.test(arg)
                    )}
                    isInvalid={this.state.uploadForm.department.invalid}
                  />
                  <Input
                    style={{ display: "None" }}
                    invalid={this.state.uploadForm.department.invalid}
                  />
                  <FormFeedback>Please enter a valid department.</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="class">Class</Label>
                  <Input
                    name="courseNumber"
                    id="class"
                    placeholder="31"
                    value={this.state.uploadForm.courseNumber.value}
                    invalid={this.state.uploadForm.courseNumber.invalid}
                    onChange={this.handleChange(
                      "courseNumber",
                      (arg: string) => /^[a-zA-Z]?\d{1,3}[a-zA-Z]?$/.test(arg),
                      (arg: string) => arg.toUpperCase()
                    )}
                  />
                  <FormFeedback>Please enter a valid course code.</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="professor">Professor</Label>
                  <Input
                    name="professor"
                    id="professor"
                    placeholder="David Smallberg"
                    value={this.state.uploadForm.professor.value}
                    invalid={this.state.uploadForm.professor.invalid}
                    onChange={this.handleChange(
                      "professor",
                      (arg: string) => /^[a-zA-Z ]{2,50}$/.test(arg),
                      (arg: string) =>
                        arg.replace(/\b\w/g, l => l.toUpperCase())
                    )}
                  />
                  <FormFeedback>Please enter a valid name.</FormFeedback>
                </FormGroup>
              </div>
              <div className="col">
                <FormGroup>
                  <Label for="year">Year</Label>
                  <Input
                    type="number"
                    name="year"
                    id="year"
                    placeholder="2018"
                    value={this.state.uploadForm.year.value}
                    invalid={this.state.uploadForm.year.invalid}
                    onChange={this.handleChange(
                      "year",
                      (arg: string) =>
                        parseInt(arg) >= 2000 && parseInt(arg) < 2500
                    )}
                  />
                  <FormFeedback>Please enter a valid year.</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="quarter">Quarter</Label>
                  <Input
                    type="select"
                    name="quarter"
                    id="quarter"
                    value={this.state.uploadForm.quarter.value}
                    onChange={this.handleChange("quarter")}
                  >
                    <option>Summer</option>
                    <option>Fall</option>
                    <option>Winter</option>
                    <option>Spring</option>
                    <option>N/A</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="name">File</Label>
                  <Input
                    type="file"
                    id="uploadedFile"
                    name="name"
                    onChange={this.handleFileUpload}
                    invalid={this.state.uploadForm.file.invalid}
                    accept=".pdf,.doc,.docx"
                    multiple={false}
                  />
                  <FormText color="muted">
                    Only PDFs and Word documents are accepted.
                  </FormText>
                  <FormFeedback>Please select a valid file type.</FormFeedback>
                </FormGroup>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <Button
                  onClick={this.handleUpload}
                  disabled={
                    this.state.isUploading ||
                    Object.keys(this.state.uploadForm).reduce((prev, curr) => {
                      return (
                        prev || this.state.uploadForm[curr].invalid !== false
                      );
                    }, false)
                  }
                  color="success"
                >
                  {this.state.isUploading
                    ? this.state.uploadPercent.toFixed(1) + "%"
                    : "Submit"}
                </Button>
                <span className="message">{this.state.message}</span>
              </div>
            </div>
          </Form>
        </UncontrolledCollapse>

        <div className="row">
          <div className="col">
            <FileTable />
          </div>
        </div>
      </div>
    );
  }
}

export default TestBankPage;
