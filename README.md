# DMG in NodeJs

After downloaded the project open terminal in folder of the project

## Running Command
```
$ npm install
```
and 
```
$ npm start
```
## APIs

`Login` -> [post] `/auth/login`<br/>
`Create User` -> [post] `/api/user/create`<br/>

Values
* username, password<br/>

`Get Me` -> [get] `/api/user`<br/>
<!-- TABLE OF CONTENTS -->
<details>
  <summary>Object</summary>
  <ol>
    <li>
      <a href="#">Create Object</a> -> [post] `/api/object`
      <p>Values</p>
      <ul>
        <li>`img`</li>
        <li>`logo`</li>
        <li>`title`</li>
        <li>`description`</li>
        <li>`doneApartments`</li>
        <li>`feld`</li>
      </ul>
    </li>
    <li>
        <a href="#">Get Objects</a> -> [get] `/api/object`
    </li>
    <li>
        <a href="#">Get Object By Id</a> -> [get] `/api/object/{id}`
    </li>
    <li>
        <a href="#">Update Object By Id</a> -> [patch] `/api/object/{id}`
    </li>
    <li>
        <a href="#">Delete Object By Id</a> -> [delete] `/api/object/{id}`
    </li>
  </ol>
</details>


<!-- Values
* img, logo, title, description, doneApartments, feld<br/> -->

<!-- `Get Objects` -> [get] `/api/object`<br/>
`Get Object By Id` -> [get] `/api/object/{id}`<br/>
`Update Object By Id` -> [patch] `/api/object/{id}`<br/>
`Delete Object By Id` -> [delete] `/api/object/{id}`<br/> -->

