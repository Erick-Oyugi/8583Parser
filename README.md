# About

### This project contains test logic for ISO-8583 parser. Once the logic is completed and tested manually, it will be added as a kong plugin

## Work items
- [x] Create a REST to ISO-8583 transformer 
- [ ] Create an ISO-8583 response to REST transformer(IF REQUIRED)
- [x] Match field information with BITMAP data 
- [x] Validate the ISO-8583 data fields
- [ ] Move REST to ISO-8583 transformer logic to kong plugin
- [ ] Move ISO-8583 response to REST transformer logic to kong plugin(IF REQUIRED)
- [ ] Communicate with the ISO server using TCP pipe

## Example Request:
Send a POST request to http://localhost:3000 with the JSON body given below: 
```
{
	"type":"NETWORK_MANAGEMENT_REQUEST",
	"dataFields":{
		"Date and time transmission":"1013135825",
		"Systems trace audit number":"005825",
		"Time local transaction":"015825",
		"Date local transaction":"1013",
		"Network management information code":"301"
	}
}
```

Try changing the field values to get appropriate error messages


## Dev notes : Ignore what is below
Service responsibility : 
1. Take rest body and transform it to proper ISO
2. Take the converted ISO and receive the response, and convert the iso response and send it as rest response 

This service again serves as a gateway and as a REST wrapper around the TCP body

# 8583Parser
# 8583Parser
# 8583Parser
