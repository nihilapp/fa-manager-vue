- 중요 규칙 아래의 코드블럭들에는 반영이 안되어있으나 다음과 같은 규칙을 준수합니다.
- id 컬럼은 최상위에 존재합니다.
- 공통 컬럼들인 use_yn, delete_yn, creator_id, create_date, updater_id, update_date, deleter_id, delete_date 컬럼은 최하위에 존재합니다.

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    discord_id VARCHAR(100),
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    use_yn CHAR(1) DEFAULT 'Y' NOT NULL,
    delete_yn CHAR(1) DEFAULT 'N' NOT NULL,
    creator_id BIGINT,
    create_date DATETIME(6),
    updater_id BIGINT,
    update_date DATETIME(6),
    deleter_id BIGINT,
    delete_date DATETIME(6),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT uk_users_discord_id UNIQUE (discord_id)
);

CREATE INDEX idx_users_name ON users(name);
```

```sql
CREATE TABLE campaigns (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    use_yn CHAR(1) DEFAULT 'Y' NOT NULL,
    delete_yn CHAR(1) DEFAULT 'N' NOT NULL,
    creator_id BIGINT,
    create_date DATETIME(6),
    updater_id BIGINT,
    update_date DATETIME(6),
    deleter_id BIGINT,
    delete_date DATETIME(6),
    name VARCHAR(50) NOT NULL,
    description VARCHAR(1000),
    status VARCHAR(20) NOT NULL,
    start_date DATETIME(6) NOT NULL,
    end_date DATETIME(6),
    CONSTRAINT uk_campaigns_name UNIQUE (name)
);

CREATE INDEX idx_campaigns_status ON campaigns(status);

CREATE TABLE campaign_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    use_yn CHAR(1) DEFAULT 'Y' NOT NULL,
    delete_yn CHAR(1) DEFAULT 'N' NOT NULL,
    creator_id BIGINT,
    create_date DATETIME(6),
    updater_id BIGINT,
    update_date DATETIME(6),
    deleter_id BIGINT,
    delete_date DATETIME(6),
    user_id BIGINT,
    campaign_id BIGINT,
    role VARCHAR(20) NOT NULL,
    CONSTRAINT uk_campaign_members_user_campaign UNIQUE (user_id, campaign_id),
    CONSTRAINT fk_campaign_members_users FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_campaign_members_campaigns FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);
```

```sql
CREATE TABLE sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    use_yn CHAR(1) DEFAULT 'Y' NOT NULL,
    delete_yn CHAR(1) DEFAULT 'N' NOT NULL,
    creator_id BIGINT,
    create_date DATETIME(6),
    updater_id BIGINT,
    update_date DATETIME(6),
    deleter_id BIGINT,
    delete_date DATETIME(6),
    campaign_id BIGINT,
    no INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(2000),
    max_player INT,
    reward_exp INT,
    reward_gold INT,
    status VARCHAR(20),
    play_date DATETIME(6),
    CONSTRAINT fk_sessions_campaigns FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

CREATE INDEX idx_session_no ON sessions(no);
CREATE INDEX idx_session_name ON sessions(name);

CREATE TABLE session_players (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    use_yn CHAR(1) DEFAULT 'Y' NOT NULL,
    delete_yn CHAR(1) DEFAULT 'N' NOT NULL,
    creator_id BIGINT,
    create_date DATETIME(6),
    updater_id BIGINT,
    update_date DATETIME(6),
    deleter_id BIGINT,
    delete_date DATETIME(6),
    session_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    character_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    CONSTRAINT fk_session_players_sessions FOREIGN KEY (session_id) REFERENCES sessions(id),
    CONSTRAINT fk_session_players_users FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_session_players_characters FOREIGN KEY (character_id) REFERENCES characters(id)
);

CREATE TABLE session_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    use_yn CHAR(1) DEFAULT 'Y' NOT NULL,
    delete_yn CHAR(1) DEFAULT 'N' NOT NULL,
    creator_id BIGINT,
    create_date DATETIME(6),
    updater_id BIGINT,
    update_date DATETIME(6),
    deleter_id BIGINT,
    delete_date DATETIME(6),
    session_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT,
    file_url VARCHAR(255),
    CONSTRAINT fk_session_logs_sessions FOREIGN KEY (session_id) REFERENCES sessions(id),
    CONSTRAINT fk_session_logs_users FOREIGN KEY (user_id) REFERENCES users(id)
);
```

```sql
CREATE TABLE characters (
    -- 공통 필드 (CommonEntity 상속)
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
    use_yn CHAR(1) DEFAULT 'Y' NOT NULL COMMENT '사용 여부',
    delete_yn CHAR(1) DEFAULT 'N' NOT NULL COMMENT '삭제 여부',
    creator_id BIGINT COMMENT '생성자 ID',
    create_date DATETIME(6) COMMENT '생성일시',
    updater_id BIGINT COMMENT '수정자 ID',
    update_date DATETIME(6) COMMENT '수정일시',
    deleter_id BIGINT COMMENT '삭제자 ID',
    delete_date DATETIME(6) COMMENT '삭제일시',

    -- 캐릭터 기본 정보
    user_id BIGINT NOT NULL COMMENT '소유자 유저 ID',
    campaign_id BIGINT COMMENT '소속 캠페인 ID',
    name VARCHAR(50) NOT NULL COMMENT '캐릭터 이름',
    status VARCHAR(20) NOT NULL COMMENT '캐릭터 상태',
    race VARCHAR(30) NOT NULL COMMENT '종족',
    start_level INT DEFAULT 0 NOT NULL COMMENT '시작 레벨',
    start_exp INT DEFAULT 0 NOT NULL COMMENT '시작 경험치',

    -- 시작 소지 자금 (CharacterCurrency 임베디드)
    start_currency_cp INT COMMENT '시작 자금(Copper)',
    start_currency_sp INT COMMENT '시작 자금(Silver)',
    start_currency_ep INT COMMENT '시작 자금(Electrum)',
    start_currency_gp INT COMMENT '시작 자금(Gold)',
    start_currency_pp INT COMMENT '시작 자금(Platinum)',

    -- 장비 정보 (CharacterEquipment 임베디드)
    main_hand VARCHAR(100) COMMENT '주무장',
    off_hand VARCHAR(100) COMMENT '보조무장',
    armor VARCHAR(100) COMMENT '갑옷',
    head VARCHAR(100) COMMENT '머리',
    gauntlet VARCHAR(100) COMMENT '장갑',
    boots VARCHAR(100) COMMENT '부츠',
    belt VARCHAR(100) COMMENT '벨트',
    cloak VARCHAR(100) COMMENT '망토',
    accessory1 VARCHAR(100) COMMENT '기타 장비 1',
    accessory2 VARCHAR(100) COMMENT '기타 장비 2',
    accessory3 VARCHAR(100) COMMENT '기타 장비 3',
    accessory4 VARCHAR(100) COMMENT '기타 장비 4',

    -- 힘/민첩 제한 아이템 정보 (CharacterRequirementStrDex 임베디드)
    req_str_dex8 VARCHAR(100) COMMENT '힘/민첩 8 제한',
    req_str_dex10 VARCHAR(100) COMMENT '힘/민첩 10 제한',
    req_str_dex12 VARCHAR(100) COMMENT '힘/민첩 12 제한',
    req_str_dex14 VARCHAR(100) COMMENT '힘/민첩 14 제한',
    req_str16 VARCHAR(100) COMMENT '힘 16 제한',
    req_str18 VARCHAR(100) COMMENT '힘 18 제한',
    req_str20 VARCHAR(100) COMMENT '힘 20 제한',

    -- 건강 제한 아이템 정보 (CharacterRequirementCon 임베디드)
    req_con8 VARCHAR(100) COMMENT '건강 8 제한',
    req_con10 VARCHAR(100) COMMENT '건강 10 제한',
    req_con12 VARCHAR(100) COMMENT '건강 12 제한',
    req_con14 VARCHAR(100) COMMENT '건강 14 제한',
    req_con16 VARCHAR(100) COMMENT '건강 16 제한',
    req_con18 VARCHAR(100) COMMENT '건강 18 제한',
    req_con20 VARCHAR(100) COMMENT '건강 20 제한',

    CONSTRAINT fk_characters_users FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_characters_campaigns FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

CREATE INDEX idx_characters_name ON characters(name);
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_status ON characters(status);
```

```sql
CREATE TABLE character_classes (
    character_id BIGINT NOT NULL COMMENT '캐릭터 ID',
    class_name VARCHAR(50) NOT NULL COMMENT '클래스 이름',
    level INT NOT NULL COMMENT '해당 클래스 레벨',
    
    CONSTRAINT fk_character_classes_characters FOREIGN KEY (character_id) REFERENCES characters(id)
);
```

```sql
CREATE TABLE docs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    use_yn CHAR(1) DEFAULT 'Y' NOT NULL,
    delete_yn CHAR(1) DEFAULT 'N' NOT NULL,
    creator_id BIGINT,
    create_date DATETIME(6),
    updater_id BIGINT,
    update_date DATETIME(6),
    deleter_id BIGINT,
    delete_date DATETIME(6),
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(500),
    category VARCHAR(50) NOT NULL,
    content TEXT,
    CONSTRAINT fk_docs_users FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_docs_title ON docs(title);
CREATE INDEX idx_docs_category ON docs(category);

CREATE TABLE log_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    use_yn CHAR(1) DEFAULT 'Y' NOT NULL,
    delete_yn CHAR(1) DEFAULT 'N' NOT NULL,
    creator_id BIGINT,
    create_date DATETIME(6),
    updater_id BIGINT,
    update_date DATETIME(6),
    deleter_id BIGINT,
    delete_date DATETIME(6),
    user_id BIGINT,
    table_name VARCHAR(50) NOT NULL,
    target_id BIGINT NOT NULL,
    action_type VARCHAR(20) NOT NULL,
    old_data TEXT,
    new_data TEXT,
    description VARCHAR(1000),
    CONSTRAINT fk_log_history_users FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_log_history_target ON log_history(table_name, target_id);
```
