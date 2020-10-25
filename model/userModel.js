function User(userId,firstName,lastName,email,bucket,key,location,uploadTime,updateTime,description) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.bucket = bucket;
    this.key = key;
    this.location = location;
    this.uploadTime = uploadTime;
    this.updateTime = updateTime;
    this.description = description;

    function setUserId(userId) {
        this.userId = userId;
    }

    function getUserId() {
        return this.userId;
    }

    function setFirstName(firstName) {
        this.firstName = firstName;
    }

    function getFirstName() {
        return this.firstName;
    }

    function setLastName(lastName) {
        this.lastName = lastName;
    }

    function getLastName() {
        return this.lastName;
    }

    function setEmail(email) {
        this.email = email;
    }

    function getEmail() {
        return this.email;
    }

    function setBucket(bucket) {
        this.bucket = bucket;
    }

    function getBucket() {
        return this.bucket;
    }

    function setKey(key) {
        this.key = key;
    }

    function getKey() {
        return this.key;
    }

    function setLocation(location) {
        this.location = location;
    }

    function getLocation() {
        return this.location;
    }

    function setUploadTime(uploadTime) {
        this.uploadTime = uploadTime;
    }

    function getUploadTime() {
        return this.uploadTime;
    }

    function setUpdateTime(updateTime) {
        this.updateTime = updateTime;
    }

    function getUpdateTime() {
        return this.updateTime;
    }

    function setDescription(description) {
        this.description = description;
    }

    function getDescription() {
        return this.description;
    }
}