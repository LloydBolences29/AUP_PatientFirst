import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const XrayUpload = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Uploaded file:", file);
        }
    };

    const xraySidebarLinks = [
        { label: "Dashboard", path: "/xray-dashboard" },
        { label: "Billing", path: "/xray-billing" },
        { label: "Upload", path: "/xray-upload" },
    ];

    return (
        <div>
            <Sidebar 
                links={xraySidebarLinks} 
                pageContent={
                    <Container>
                        <h1 className="my-4"> Upload Xray Result </h1>
                        <Row className="mb-4">
                            <Col>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Search..." 
                                    value={searchTerm} 
                                    onChange={handleSearchChange} 
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="imageUpload">
                                    <Form.Label>Upload Image:</Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageUpload} 
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col>
                                <Button variant="primary">Submit</Button>
                            </Col>
                        </Row>
                    </Container>
                } 
            />
        </div>
    );
};

export default XrayUpload;
