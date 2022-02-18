use aho_corasick::{AhoCorasickBuilder, AhoCorasick};
use neon::prelude::*;

pub struct AhoCorasickBox {
    value: Box<AhoCorasick>
}

impl Finalize for AhoCorasickBox {}

// createAhoCorasick(patterns: string[], options: { caseSensitive: boolean }): AhoCorasickBox
fn create_aho_corasick(mut cx: FunctionContext) -> JsResult<JsBox<AhoCorasickBox>> {
    let patterns = cx.argument::<JsArray>(0)?
        .to_vec(&mut cx)?
        .into_iter()
        .map(|v| {
            v.downcast::<JsString, _>(&mut cx)
                .or_throw(&mut cx)
                .map(|v| v.value(&mut cx))
        })
        .collect::<Result<Vec<_>, _>>()?;

    let options = cx.argument::<JsObject>(1)?;
    let case_sensitive = options
        .get(&mut cx, "caseSensitive")?
        .downcast::<JsBoolean, _>(&mut cx)
        .or_throw(&mut cx)?
        .value(&mut cx);

    let ac = AhoCorasickBuilder::new()
        .ascii_case_insensitive(!case_sensitive)
        .build(patterns);

    Ok(cx.boxed(AhoCorasickBox {
        value: Box::new(ac)
    }))
}

// isMatch(ac: AhoCorasickBox, text: string): boolean
fn is_match(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let ac = &cx.argument::<JsBox<AhoCorasickBox>>(0)?.value;

    let text = cx.argument::<JsString>(1)?
        .downcast::<JsString, _>(&mut cx)
        .or_throw(&mut cx)?
        .value(&mut cx);

    let result = ac.is_match(text);

    Ok(cx.boolean(result))
}

// findAll(ac: AhoCorasickBox, text: string): string[]
fn find_all(mut cx: FunctionContext) -> JsResult<JsArray> {
    let ac = &cx.argument::<JsBox<AhoCorasickBox>>(0)?.value;
    let text = cx.argument::<JsString>(1)?
        .downcast::<JsString, _>(&mut cx)
        .or_throw(&mut cx)?
        .value(&mut cx);

    let mut matches = vec![];
    for mat in ac.find_iter(&text) {
        matches.push(&text[mat.start()..mat.end()]);
    }
    matches.sort_unstable();
    matches.dedup();

    let js_array = JsArray::new(&mut cx, matches.len() as u32);
    matches.iter()
        .enumerate()
        .for_each(|(i, obj)| {
            let js_string = cx.string(obj);
            js_array.set(&mut cx, i as u32, js_string).unwrap();
        });

    Ok(js_array)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("createAhoCorasick", create_aho_corasick)?;
    cx.export_function("isMatch", is_match)?;
    cx.export_function("findAll", find_all)?;
    Ok(())
}
