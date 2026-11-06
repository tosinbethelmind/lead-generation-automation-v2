with open('src/app/admin/mobile/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

bad_str = 'setFeedbackMsg(\u2705  triggered successfully!);'
good_str = 'setFeedbackMsg(`\u2705 ${label} triggered successfully!`);'

if bad_str in text:
    text = text.replace(bad_str, good_str)
    with open('src/app/admin/mobile/page.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Fixed line 176 via script file!')
else:
    print('bad_str not found')
