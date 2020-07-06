import * as React from "react";

class PendingApprovalPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h4 className="mt-2">
          Your account is currently pending approval
        </h4>
        <h5 className="mt-2">
          Please <a target="_blank" href="https://www.facebook.com/groups/122880215014668/">message an admin</a> or <a href="mailto:exco@uclassa.org">email us</a> for access
        </h5>
      </div>
    );
  }
}

export default PendingApprovalPage;
