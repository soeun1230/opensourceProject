import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from './header/Header';
import SideBar from './SideBar';

const FunctionExplainRepo = () => {
  return (
    <Box style={{ display: 'flex', minHeight: '100vh', overflowY: 'auto', backgroundColor: '#f4f4f9' }}>
      <SideBar />
      <Box style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, paddingBottom: '20px' }}>
        <Header theme="function" style={{ flexShrink: 0 }} />

        {/** Accordion items **/}
        {accordionItems.map((item, index) => (
          <Accordion
            key={index}
            style={{
              margin: '15px 20px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.12)',
              transition: 'box-shadow 0.3s ease-in-out',
              overflow: 'hidden',
              border: '1px solid #e0e0e0',
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0px 10px 20px rgba(0, 0, 0, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0px 6px 18px rgba(0, 0, 0, 0.12)'}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: '#333' }} />}
              aria-controls={`${item.id}-content`}
              id={`${item.id}-header`}
              style={{ padding: '0 20px', backgroundColor: '#f9fafc', borderBottom: '1px solid #e0e0e0' }}
            >
              <Typography variant="h6" style={{ fontWeight: 'bold', color: '#333' }}>
                {item.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails style={{ display: 'flex', justifyContent: 'center', padding: '30px' }}>
              <img
                src={item.imgSrc}
                alt={item.altText}
                style={{
                  borderRadius: '12px',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
                  width: item.small ? '60%' : '100%', // 특정 이미지의 크기를 줄임
                  maxWidth: item.small ? '800px' : '1400px', // 최대 너비 설정
                  height: 'auto',
                  maxHeight: item.small ? '400px' : '80vh', // 특정 이미지의 최대 높이 줄임
                  objectFit: 'contain', // 이미지가 잘리지 않도록 설정
                  transition: 'transform 0.3s ease-in-out',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

const accordionItems = [
  {
    id: 'thing-upload',
    title: '전체 영역 품질 측정 기능',
    imgSrc: '/img/thingUpload.png',
    altText: 'Thing Upload',
  },
  {
    id: 'people-upload',
    title: '특정 영역 품질 측정 기능',
    imgSrc: '/img/peopleUpload.png',
    altText: 'People Upload',
  },
  {
    id: 'compress-upload',
    title: '압축 기능',
    imgSrc: '/img/abchook.png',
    altText: 'Thing Upload',
    small: true, // 작은 크기로 표시할 항목 지정
  },
  {
    id: 'noise-reduction-upload',
    title: '노이즈 제거 기능',
    imgSrc: '/img/noise.png',
    altText: 'Thing Upload',
    small: true, // 작은 크기로 표시할 항목 지정
  },
  {
    id: 'file-format-conversion-upload',
    title: '파일 포맷 변환 기능',
    imgSrc: '/img/fileformat.png',
    altText: 'Thing Upload',
    small: true, // 작은 크기로 표시할 항목 지정
  }
];

export default FunctionExplainRepo;

