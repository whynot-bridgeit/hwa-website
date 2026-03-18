/**
 * HWA 홀리스틱웰니스얼라이언스협회 회원사 입회 신청 폼 스크립트
 * 
 * 사용 방법:
 * 1. Google Forms에서 새 양식을 생성합니다.
 * 2. 우측 상단의 점 3개 메뉴(더보기) > '스크립트 편집기'를 클릭합니다.
 * 3. 기존 코드를 모두 지우고 이 코드를 붙여넣습니다.
 * 4. 폼에 맞게 설정(Config)을 수정합니다.
 * 5. 저장 후 '실행' 버튼을 눌러 권한을 승인합니다.
 * 6. 왼쪽 메뉴에서 '트리거(시계 아이콘)'를 클릭하고, 
 *    새 트리거 추가 > 실행할 함수: onSubmit, 이벤트 소스: 폼에서, 이벤트 유형: 양식 제출시 로 설정합니다.
 */

const CONFIG = {
  // 알림을 받을 이메일 주소
  ADMIN_EMAIL: 'quester.bridgeit@gmail.com',
  
  // 폼에 추가할 질문 항목들 (setupForm 함수 실행 시 자동 생성됨)
  FORM_TITLE: 'HWA 홀리스틱웰니스얼라이언스협회 회원사 입회 신청서',
  FORM_DESCRIPTION: '홀리스틱웰니스얼라이언스협회(HWA)의 회원사로 등록하기 위한 신청서입니다. 작성해주신 내용은 회원사 디렉토리 프로필 구성에 활용됩니다.\n\n문의: quester.bridgeit@gmail.com',
  
  QUESTIONS: [
    { title: '회사/기관명 (필수)', type: 'TEXT', required: true },
    { title: '대표자 성명 (필수)', type: 'TEXT', required: true },
    { title: '담당자 성명 및 직급 (필수)', type: 'TEXT', required: true },
    { title: '담당자 연락처 (필수)', type: 'TEXT', required: true },
    { title: '담당자 이메일 (필수)', type: 'TEXT', required: true },
    { title: '전문 분야 선택 (필수)', type: 'MULTIPLE_CHOICE', required: true, 
      choices: ['요가 · 명상', '영양 · 식이', '테라피', '피트니스', '심리 · 상담', '웰니스 공간', '기타'] },
    { title: '회사/기관 한 줄 소개 (필수)', type: 'TEXT', required: true },
    { title: '상세 소개 (필수)', type: 'PARAGRAPH', required: true },
    { title: '주요 인증 및 자격 사항', type: 'PARAGRAPH', required: false, helpText: '예: RYT-500 국제요가연맹 인증, 임상영양사 등' },
    { title: '주요 레퍼런스 (협력/운영 사례)', type: 'PARAGRAPH', required: false, helpText: '예: 00기업 임직원 프로그램 운영, 00기관 협력 등' },
    { title: '보도자료 및 미디어 링크', type: 'PARAGRAPH', required: false, helpText: '관련 기사나 미디어 링크를 입력해주세요.' },
    { title: '공식 웹사이트 또는 SNS 링크', type: 'TEXT', required: false }
  ]
};

/**
 * 폼이 제출되었을 때 실행되는 함수
 */
function onSubmit(e) {
  try {
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    
    let emailBody = '<div style="font-family: sans-serif; max-w-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">';
    emailBody += '<h2 style="color: #2f4f4f; border-bottom: 2px solid #8fbc8f; padding-bottom: 10px;">새로운 HWA 회원사 입회 신청이 접수되었습니다.</h2>';
    emailBody += '<p style="color: #666; font-size: 14px;">아래의 신청 내용을 확인해 주세요.</p>';
    emailBody += '<table style="width: 100%; border-collapse: collapse; margin-top: 20px;">';
    
    let companyName = '미상';
    
    // 응답 내용 순회하며 이메일 본문 생성
    for (let i = 0; i < itemResponses.length; i++) {
      const itemResponse = itemResponses[i];
      const question = itemResponse.getItem().getTitle();
      const answer = itemResponse.getResponse();
      
      if (question.includes('회사/기관명')) {
        companyName = answer;
      }
      
      emailBody += '<tr>';
      emailBody += '<td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0; width: 30%; font-weight: bold; color: #4a5568; vertical-align: top;">' + question + '</td>';
      emailBody += '<td style="padding: 12px 8px; border-bottom: 1px solid #f0f0f0; color: #2d3748; white-space: pre-wrap;">' + (answer || '-') + '</td>';
      emailBody += '</tr>';
    }
    
    emailBody += '</table>';
    emailBody += '<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #a0aec0; font-size: 12px;">';
    emailBody += '<p>본 메일은 HWA 회원사 입회 신청 폼에서 자동 발송되었습니다.</p>';
    emailBody += '</div></div>';
    
    const subject = `[HWA] 신규 회원사 입회 신청 - ${companyName}`;
    
    // 이메일 발송
    MailApp.sendEmail({
      to: CONFIG.ADMIN_EMAIL,
      subject: subject,
      htmlBody: emailBody
    });
    
    Logger.log(`이메일 발송 성공: ${companyName}`);
    
  } catch (error) {
    Logger.log('이메일 발송 중 오류 발생: ' + error.toString());
    
    // 오류 발생 시 관리자에게 알림
    MailApp.sendEmail({
      to: CONFIG.ADMIN_EMAIL,
      subject: '[HWA 폼 오류] 회원사 신청 처리 중 오류 발생',
      body: '폼 제출 처리 중 다음 오류가 발생했습니다:\n\n' + error.toString()
    });
  }
}

/**
 * (선택 사항) 새 폼을 자동으로 세팅해주는 함수
 * 빈 폼에서 이 함수를 한 번 실행하면 질문 항목이 자동 생성됩니다.
 */
function setupForm() {
  const form = FormApp.getActiveForm();
  
  if (!form) {
    Logger.log('활성화된 폼을 찾을 수 없습니다. 폼의 스크립트 편집기에서 실행해주세요.');
    return;
  }
  
  // 기존 항목 모두 삭제
  const items = form.getItems();
  for (let i = 0; i < items.length; i++) {
    form.deleteItem(items[i]);
  }
  
  // 폼 기본 설정
  form.setTitle(CONFIG.FORM_TITLE);
  form.setDescription(CONFIG.FORM_DESCRIPTION);
  form.setCollectEmail(true);
  form.setConfirmationMessage('HWA 회원사 입회 신청이 성공적으로 접수되었습니다. 담당자가 확인 후 연락드리겠습니다. 감사합니다.');
  
  // 질문 추가
  CONFIG.QUESTIONS.forEach(q => {
    let item;
    switch (q.type) {
      case 'TEXT':
        item = form.addTextItem();
        break;
      case 'PARAGRAPH':
        item = form.addParagraphTextItem();
        break;
      case 'MULTIPLE_CHOICE':
        item = form.addMultipleChoiceItem();
        item.setChoiceValues(q.choices);
        break;
    }
    
    item.setTitle(q.title).setRequired(q.required);
    
    if (q.helpText) {
      item.setHelpText(q.helpText);
    }
  });
  
  Logger.log('폼 설정이 완료되었습니다.');
}
