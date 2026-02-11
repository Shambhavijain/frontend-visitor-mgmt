//Signup
pm.test("Status code is 200, 201 (successful signup) or 409 (email already exists)", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 201, 409]);
});

pm.test("Response time is under 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(3000);
});

pm.test("Content-Type header is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("Response body is a valid JSON object", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
});

pm.test("Response contains required fields: status and message", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("status");
    pm.expect(jsonData).to.have.property("message");
});

pm.test("Status field is either 'success' or 'error'", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.status).to.be.oneOf(["success", "error"]);
});

pm.test("Message field is a non-empty string", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.be.a("string");
    pm.expect(jsonData.message).to.not.be.empty;
});

pm.test("Successful signup returns status 'success' with data field", function () {
    const jsonData = pm.response.json();
    if (pm.response.code === 200 || pm.response.code === 201) {
        pm.expect(jsonData.status).to.eql("success");
        pm.expect(jsonData).to.have.property("data");
        pm.expect(jsonData.message.toLowerCase()).to.include("success");
    }
});

pm.test("Duplicate email returns status 'error' with appropriate message", function () {
    const jsonData = pm.response.json();
    if (pm.response.code === 409) {
        pm.expect(jsonData.status).to.eql("error");
        pm.expect(jsonData.message.toLowerCase()).to.include("email already exists");
    }
});

pm.test("Response structure is correct for signup endpoint", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.not.be.an("array");
    pm.expect(Object.keys(jsonData).length).to.be.above(0);
});

//Login
pm.test("Status code is 200 or 401", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 401]);
});

pm.test("Response time is under 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(3000);
});

pm.test("Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("Response body is valid JSON object", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
});

pm.test("Response has status and message fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("status");
    pm.expect(jsonData).to.have.property("message");
});

if (pm.response.code === 200) {
    pm.test("Status is 'success'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.status).to.eql("success");
    });

    pm.test("Message is 'Login successful'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.message).to.eql("Login successful");
    });

    pm.test("Data object exists", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property("data");
        pm.expect(jsonData.data).to.be.an("object");
    });

    pm.test("Token exists and is not empty", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data).to.have.property("token");
        pm.expect(jsonData.data.token).to.be.a("string").and.not.empty;
    });

    pm.test("User object exists", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data).to.have.property("user");
        pm.expect(jsonData.data.user).to.be.an("object");
    });

    pm.test("User role exists", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data.user).to.have.property("role");
    });

    const jsonData = pm.response.json();
    if (jsonData.data && jsonData.data.token) {
        pm.environment.set("auth_token", jsonData.data.token);
    }
}

if (pm.response.code === 401) {
    pm.test("Status is 'error'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.status).to.eql("error");
    });

    pm.test("Message is 'Invalid email or password'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.message).to.eql("Invalid email or password");
    });
}

//Users
pm.test("Status code is 200 or 404", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 404]);
});

pm.test("Response time is under 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("Response body is valid JSON object", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
});

pm.test("Response has status and message fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("status");
    pm.expect(jsonData).to.have.property("message");
});

if (pm.response.code === 200) {
    pm.test("Status is 'success'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.status).to.eql("success");
    });

    pm.test("Message is 'User fetched successfully'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.message).to.eql("User fetched successfully");
    });

    pm.test("Data object exists", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property("data");
        pm.expect(jsonData.data).to.be.an("object");
    });

    pm.test("Data.id exists and is not empty", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data).to.have.property("id");
        pm.expect(jsonData.data.id).to.not.be.empty;
    });

    pm.test("Data.username exists", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data).to.have.property("username");
    });

    pm.test("Data.email exists and is valid email format", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data).to.have.property("email");
        pm.expect(jsonData.data.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    pm.test("Data.role exists", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data).to.have.property("role");
    });

    pm.test("Data.address exists", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data).to.have.property("address");
    });

    pm.test("Data.flat_no exists", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data).to.have.property("flat_no");
    });

    pm.test("Data.tower exists", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data).to.have.property("tower");
    });
}

if (pm.response.code === 404) {
    pm.test("Status is 'error'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.status).to.eql("error");
    });

    pm.test("Message is 'entity not found'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.message).to.eql("entity not found");
    });
}

pm.test("Status code is 200 or 404", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 404]);
});

pm.test("Response time is under 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("Response body is valid JSON object", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
});

pm.test("Response has status and message fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("status");
    pm.expect(jsonData).to.have.property("message");
});

if (pm.response.code === 200) {
    pm.test("Status is 'success'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.status).to.eql("success");
    });

    pm.test("Message is 'Users fetched successfully'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.message).to.eql("Users fetched successfully");
    });

    pm.test("Data is an array", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property("data");
        pm.expect(jsonData.data).to.be.an("array");
    });

    pm.test("Each user has valid id that is not empty", function () {
        const jsonData = pm.response.json();
        jsonData.data.forEach(function (user, index) {
            pm.expect(user).to.have.property("id");
            pm.expect(user.id).to.not.be.empty;
        });
    });

    pm.test("Each user has username", function () {
        const jsonData = pm.response.json();
        jsonData.data.forEach(function (user, index) {
            pm.expect(user).to.have.property("username");
        });
    });

    pm.test("Each user has valid email format", function () {
        const jsonData = pm.response.json();
        jsonData.data.forEach(function (user, index) {
            pm.expect(user).to.have.property("email");
            pm.expect(user.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        });
    });

    pm.test("Each user has role equal to 'owner'", function () {
        const jsonData = pm.response.json();
        jsonData.data.forEach(function (user, index) {
            pm.expect(user).to.have.property("role");
            pm.expect(user.role).to.eql("owner");
        });
    });

    pm.test("Each user has address", function () {
        const jsonData = pm.response.json();
        jsonData.data.forEach(function (user, index) {
            pm.expect(user).to.have.property("address");
        });
    });

    pm.test("Each user has flat_no", function () {
        const jsonData = pm.response.json();
        jsonData.data.forEach(function (user, index) {
            pm.expect(user).to.have.property("flat_no");
        });
    });

    pm.test("Each user has tower", function () {
        const jsonData = pm.response.json();
        jsonData.data.forEach(function (user, index) {
            pm.expect(user).to.have.property("tower");
        });
    });
}

if (pm.response.code === 404) {
    pm.test("Status is 'error'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.status).to.eql("error");
    });

    pm.test("Message is 'entity not found'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.message).to.eql("entity not found");
    });
}

pm.test("Status code is 200 or 404", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 404]);
});

pm.test("Response time is under 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("Response body is valid JSON object", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
});

pm.test("Response has status and message fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("status");
    pm.expect(jsonData).to.have.property("message");
});

if (pm.response.code === 200) {
    pm.test("Success response - status is 'success'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.status).to.eql("success");
    });

    pm.test("Success response - message is 'User deleted successfully'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.message).to.eql("User deleted successfully");
    });

    pm.test("Success response - data is null", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data).to.be.null;
    });
}

if (pm.response.code === 404) {
    pm.test("Error response - status is 'error'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.status).to.eql("error");
    });

    pm.test("Error response - message is 'entity not found'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.message).to.eql("entity not found");
    });
}

pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is under 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("Response body is valid JSON object", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
});

pm.test("Response has status and message fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("status");
    pm.expect(jsonData).to.have.property("message");
});

pm.test("Status is success", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql("success");
});

pm.test("Message is Users count fetched successfully", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.eql("Users count fetched successfully");
});

pm.test("Data object exists", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("data");
    pm.expect(jsonData.data).to.be.an("object");
});

pm.test("Data.Owner exists and is a number", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property("Owner");
    pm.expect(jsonData.data.Owner).to.be.a("number");
});

pm.test("Data.Gatekeeper exists and is a number", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property("Gatekeeper");
    pm.expect(jsonData.data.Gatekeeper).to.be.a("number");
});

pm.test("Data.Owner is greater than or equal to 0", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.Owner).to.be.at.least(0);
});

pm.test("Data.Gatekeeper is greater than or equal to 0", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.Gatekeeper).to.be.at.least(0);
});

//Gatekeeper

pm.test("Status code is 201 or 409", function () {
    pm.expect(pm.response.code).to.be.oneOf([201, 409]);
});

pm.test("Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("Response body is valid JSON object", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
});

pm.test("Response has status and message fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("status");
    pm.expect(jsonData).to.have.property("message");
});

if (pm.response.code === 201) {
    pm.test("Status is 'success'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.status).to.eql("success");
    });

    pm.test("Message is 'Gatekeeper created successfully'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.message).to.eql("Gatekeeper created successfully");
    });

    pm.test("Data object exists", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property("data");
        pm.expect(jsonData.data).to.be.an("object");
    });

    pm.test("Data.id exists and is not empty", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data).to.have.property("id");
        pm.expect(jsonData.data.id).to.be.a("string").and.not.empty;
    });

    pm.test("Data.username exists", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data).to.have.property("username");
    });

    pm.test("Data.email exists and is valid email format", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data).to.have.property("email");
        pm.expect(jsonData.data.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    pm.test("Data.address exists", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data).to.have.property("address");
    });

    pm.test("Data.role exists and equals 'gatekeeper'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data).to.have.property("role");
        pm.expect(jsonData.data.role).to.eql("gatekeeper");
    });
}

if (pm.response.code === 409) {
    pm.test("Status is 'error'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.status).to.eql("error");
    });

    pm.test("Message is 'Email already exists'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.message).to.eql("Email already exists");
    });
}

pm.test("Status code is 200 or 404", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 404]);
});

pm.test("Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("Response body is valid JSON object", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
});

pm.test("Response has status and message fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("status");
    pm.expect(jsonData).to.have.property("message");
});

if (pm.response.code === 200) {

    pm.test("Success response - status is 'success'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.status).to.eql("success");
    });

    pm.test("Success response - message is 'Gatekeeper deleted successfully'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.message).to.eql("Gatekeeper deleted successfully");
    });

    pm.test("Success response - data is null", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data).to.be.null;
    });
}

if (pm.response.code === 404) {

    pm.test("Error response - status is 'error'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.status).to.eql("error");
    });

    pm.test("Error response - message is 'entity not found'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.message).to.eql("entity not found");
    });
}


pm.test("Status code is 200 or 404", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 404]);
});

pm.test("Response time is under 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("Response body is valid JSON object", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
});

pm.test("Response has status and message fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("status");
    pm.expect(jsonData).to.have.property("message");
});

if (pm.response.code === 200) {
    pm.test("Status is 'success'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.status).to.eql("success");
    });

    pm.test("Message is 'Gatekeepers fetched successfully'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.message).to.eql("Gatekeepers fetched successfully");
    });

    pm.test("Data is an array", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data).to.be.an("array");
    });

    pm.test("Each gatekeeper has valid properties", function () {
        const jsonData = pm.response.json();
        if (jsonData.data.length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            jsonData.data.forEach(function (gatekeeper) {
                pm.expect(gatekeeper).to.have.property("id").that.is.not.empty;
                pm.expect(gatekeeper).to.have.property("username");
                pm.expect(gatekeeper).to.have.property("email");
                pm.expect(gatekeeper.email).to.match(emailRegex);
                pm.expect(gatekeeper).to.have.property("address");
                pm.expect(gatekeeper).to.have.property("role");
                pm.expect(gatekeeper.role).to.eql("gatekeeper");
            });
        }
    });
}

if (pm.response.code === 404) {
    pm.test("Status is 'error'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.status).to.eql("error");
    });

    pm.test("Message is 'No gatekeepers found'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.message).to.eql("No gatekeepers found");
    });
}

pm.test("Status code is 200 or 404", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 404]);
});

pm.test("Response time is under 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("Response body is valid JSON object", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
});

pm.test("Response has status and message fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("status");
    pm.expect(jsonData).to.have.property("message");
});


if (pm.response.code === 200) {

    pm.test("Success response - status is 'success'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.status).to.eql("success");
    });

    pm.test("Success response - message is correct", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.message).to.eql("Gatekeeper fetched successfully");
    });

    pm.test("Success response - data object validation", function () {
        const jsonData = pm.response.json();

        pm.expect(jsonData.data).to.be.an("object");
        pm.expect(jsonData.data).to.have.property("id");
        pm.expect(jsonData.data).to.have.property("username");
        pm.expect(jsonData.data).to.have.property("email");
        pm.expect(jsonData.data).to.have.property("address");
        pm.expect(jsonData.data).to.have.property("role");
    });

    pm.test("Role should be gatekeeper", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.data.role).to.eql("gatekeeper");
    });

}

if (pm.response.code === 404) {

    pm.test("Error response - status is 'error'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.status).to.eql("error");
    });

    pm.test("Error response - message is 'entity not found'", function () {
        const jsonData = pm.response.json();
        pm.expect(jsonData.message).to.eql("entity not found");
    });
}

//Visitors

pm.test("Status code is 201", function () {
    pm.expect(pm.response.code).to.eql(201);
});

pm.test("Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("Response body is valid JSON object", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
});

pm.test("Response has status, message and data fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("status");
    pm.expect(jsonData).to.have.property("message");
    pm.expect(jsonData).to.have.property("data");
});



pm.test("Status should be success", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql("success");
});

pm.test("Message should be correct", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.eql("Visitor created successfully");
});

pm.test("Data object validation", function () {
    const jsonData = pm.response.json();
    const data = jsonData.data;

    pm.expect(data).to.be.an("object");
    pm.expect(data).to.have.property("id");
    pm.expect(data).to.have.property("name");
    pm.expect(data).to.have.property("email");
    pm.expect(data).to.have.property("tower");
    pm.expect(data).to.have.property("flat_no");
    pm.expect(data).to.have.property("status");
    pm.expect(data).to.have.property("created_at");
});



pm.test("Name matches request", function () {
    const jsonData = pm.response.json();
    const requestBody = JSON.parse(pm.request.body.raw);
    pm.expect(jsonData.data.name).to.eql(requestBody.name);
});

pm.test("Email matches request", function () {
    const jsonData = pm.response.json();
    const requestBody = JSON.parse(pm.request.body.raw);
    pm.expect(jsonData.data.email).to.eql(requestBody.email);
});

pm.test("Tower matches request", function () {
    const jsonData = pm.response.json();
    const requestBody = JSON.parse(pm.request.body.raw);
    pm.expect(jsonData.data.tower).to.eql(requestBody.tower);
});

pm.test("Flat number matches request", function () {
    const jsonData = pm.response.json();
    const requestBody = JSON.parse(pm.request.body.raw);
    pm.expect(jsonData.data.flat_no).to.eql(requestBody.flat_no);
});



pm.test("Visitor status should be approved", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.status).to.eql("approved");
});

pm.test("created_at should be a number (timestamp)", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.created_at).to.be.a("number");
});


pm.test("Status code is 200", function () {
    pm.expect(pm.response.code).to.eql(200);
});

pm.test("Response time is under 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("Response body is valid JSON object", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
});

pm.test("Response has status, message and data fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("status");
    pm.expect(jsonData).to.have.property("message");
    pm.expect(jsonData).to.have.property("data");
});

pm.test("Status should be success", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql("success");
});

pm.test("Message should be correct", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.eql("Visitor count fetched successfully");
});

pm.test("Data object should contain count field", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.an("object");
    pm.expect(jsonData.data).to.have.property("count");
});

pm.test("Count should be a number", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.count).to.be.a("number");
});

pm.test("Count should not be negative", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.count).to.be.at.least(0);
});


pm.test("Status code is 200", function () {
    pm.expect(pm.response.code).to.eql(200);
});

pm.test("Response time is under 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("Response body is valid JSON object", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
});

pm.test("Response has status, message and data fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("status");
    pm.expect(jsonData).to.have.property("message");
    pm.expect(jsonData).to.have.property("data");
});

pm.test("Status should be success", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql("success");
});

pm.test("Message should be correct", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.eql("Visitors fetched successfully");
});

pm.test("Visitors array should not be empty", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.length).to.be.at.least(0);
});

pm.test("Each visitor object has required fields", function () {
    const jsonData = pm.response.json();

    jsonData.data.forEach((visitor) => {
        pm.expect(visitor).to.have.property("id");
        pm.expect(visitor).to.have.property("name");
        pm.expect(visitor).to.have.property("email");
        pm.expect(visitor).to.have.property("tower");
        pm.expect(visitor).to.have.property("flat_no");
        pm.expect(visitor).to.have.property("status");
        pm.expect(visitor).to.have.property("created_at");
    });
});

pm.test("Validate field types for each visitor", function () {
    const jsonData = pm.response.json();

    jsonData.data.forEach((visitor) => {
        pm.expect(visitor.id).to.be.a("string");
        pm.expect(visitor.name).to.be.a("string");
        pm.expect(visitor.email).to.be.a("string");
        pm.expect(visitor.tower).to.be.a("string");
        pm.expect(visitor.flat_no).to.be.a("string");
        pm.expect(visitor.status).to.be.a("string");
        pm.expect(visitor.created_at).to.be.a("number");
    });
});

pm.test("Visitor status should be approved or declined", function () {
    const jsonData = pm.response.json();

    jsonData.data.forEach((visitor) => {
        pm.expect(visitor.status).to.be.oneOf(["approved", "declined"]);
    });
});


pm.test("Status code is 200", function () {
    pm.expect(pm.response.code).to.eql(200);
});

pm.test("Response time is under 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("Response body is valid JSON object", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
});

pm.test("Response has status, message and data fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("status");
    pm.expect(jsonData).to.have.property("message");
    pm.expect(jsonData).to.have.property("data");
});

pm.test("Status should be success", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql("success");
});

pm.test("Message should be correct", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.eql("Owner visitors fetched successfully");
});

pm.test("Data should be an array", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.an("array");
});

pm.test("Each visitor object has required fields", function () {
    const jsonData = pm.response.json();

    jsonData.data.forEach((visitor) => {
        pm.expect(visitor).to.have.property("id");
        pm.expect(visitor).to.have.property("name");
        pm.expect(visitor).to.have.property("email");
        pm.expect(visitor).to.have.property("tower");
        pm.expect(visitor).to.have.property("flat_no");
        pm.expect(visitor).to.have.property("status");
        pm.expect(visitor).to.have.property("created_at");
    });
});

pm.test("Validate field types for each visitor", function () {
    const jsonData = pm.response.json();

    jsonData.data.forEach((visitor) => {
        pm.expect(visitor.id).to.be.a("string");
        pm.expect(visitor.name).to.be.a("string");
        pm.expect(visitor.email).to.be.a("string");
        pm.expect(visitor.tower).to.be.a("string");
        pm.expect(visitor.flat_no).to.be.a("string");
        pm.expect(visitor.status).to.be.a("string");
        pm.expect(visitor.created_at).to.be.a("number");
    });
});

pm.test("Visitor status should be approved or declined", function () {
    const jsonData = pm.response.json();

    jsonData.data.forEach((visitor) => {
        pm.expect(visitor.status).to.be.oneOf(["approved", "declined"]);
    });
});


pm.test("Status code is 200", function () {
    pm.expect(pm.response.code).to.eql(200);
});

pm.test("Response time is under 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("Response body is valid JSON object", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an("object");
});

pm.test("Response has status, message and data fields", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("status");
    pm.expect(jsonData).to.have.property("message");
    pm.expect(jsonData).to.have.property("data");
});

pm.test("Status should be success", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql("success");
});

pm.test("Message should be correct", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.message).to.eql("Visitor status updated successfully");
});

pm.test("Data should be null", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.null;
});

pm.test("Request status should be either approved or declined", function () {
    const requestBody = JSON.parse(pm.request.body.raw);
    pm.expect(requestBody.status).to.be.oneOf(["approved", "declined"]);
});
